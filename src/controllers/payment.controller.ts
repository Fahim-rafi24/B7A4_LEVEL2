import { Request, Response, NextFunction } from 'express';
import { createPaymentSchema } from '../validators/payment.validator';
import * as paymentService from '../services/payment.service';
import * as rentalService from '../services/rental.service';
import { sendSuccess, sendError } from '../utils/apiResponse.util';
import { httpStatus } from '../config/http_status';
import { env } from '../config/env';

let stripe: any = null;
try {
    if (env.STRIPE_SECRET_KEY) {
        stripe = new (require('stripe'))(env.STRIPE_SECRET_KEY);
    }
} catch { /* stripe not installed */ }

export async function createPaymentIntent(req: Request, res: Response, next: NextFunction) {
    try {
        const { rentalRequestId, provider } = createPaymentSchema.parse(req.body);

        const rental = await rentalService.findRentalById(rentalRequestId);
        if (!rental) return sendError(res, httpStatus.NOT_FOUND, 'Rental request not found');
        if (rental.tenantId !== req.user!.sub) return sendError(res, httpStatus.FORBIDDEN, 'Not your rental request');
        if (rental.status !== 'approved') return sendError(res, httpStatus.BAD_REQUEST, 'Rental request is not approved yet');

        const existingPayment = await paymentService.findPaymentByRentalRequest(rentalRequestId);
        if (existingPayment && existingPayment.status === 'completed') {
            return sendError(res, httpStatus.BAD_REQUEST, 'Payment already completed');
        }

        if (provider === 'stripe') {
            if (!stripe) {
                // Fallback mock payment intent for testing
                const mockPayment = await paymentService.createPaymentRecord({
                    rentalRequestId,
                    amount: rental.property.price,
                    provider: 'stripe',
                    userId: req.user!.sub,
                    status: 'pending',
                    providerPaymentId: `pi_mock_${Date.now()}`,
                });
                return sendSuccess(res, {
                    payment: mockPayment,
                    clientSecret: `pi_mock_${Date.now()}_secret_mock`,
                }, httpStatus.CREATED, 'Payment intent created (mock)');
            }

            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(rental.property.price * 100),
                currency: 'usd',
                metadata: { rentalRequestId },
            });

            const payment = await paymentService.createPaymentRecord({
                rentalRequestId,
                amount: rental.property.price,
                provider: 'stripe',
                userId: req.user!.sub,
                providerPaymentId: paymentIntent.id,
                status: 'pending',
            });

            return sendSuccess(res, {
                payment,
                clientSecret: paymentIntent.client_secret,
            }, httpStatus.CREATED, 'Payment intent created');
        }

        const payment = await paymentService.createPaymentRecord({
            rentalRequestId,
            amount: rental.property.price,
            provider: 'sslcommerz',
            userId: req.user!.sub,
            status: 'pending',
        });

        return sendSuccess(res, { payment }, httpStatus.CREATED, 'Payment initiated');
    } catch (err) { next(err); }
}

export async function confirmPayment(req: Request, res: Response, next: NextFunction) {
    try {
        const { paymentId, transactionId } = req.body;
        const payment = await paymentService.findPaymentById(paymentId);
        if (!payment) return sendError(res, httpStatus.NOT_FOUND, 'Payment not found');
        if (payment.userId !== req.user!.sub) return sendError(res, httpStatus.FORBIDDEN, 'Not your payment');

        const updated = await paymentService.updatePaymentStatus(paymentId, 'completed', undefined, transactionId || `tx_${Date.now()}`);

        await rentalService.updateRentalStatus(
            payment.rentalRequestId,
            payment.rentalRequest.property.landlordId,
            'active'
        );

        return sendSuccess(res, updated, httpStatus.OK, 'Payment confirmed successfully');
    } catch (err) { next(err); }
}

export async function getUserPayments(req: Request, res: Response, next: NextFunction) {
    try {
        const payments = await paymentService.findUserPayments(req.user!.sub);
        return sendSuccess(res, payments, httpStatus.OK, 'Payments fetched successfully');
    } catch (err) { next(err); }
}

export async function getPaymentById(req: Request, res: Response, next: NextFunction) {
    try {
        const payment = await paymentService.findPaymentById(req.params.id as string);
        if (!payment) return sendError(res, httpStatus.NOT_FOUND, 'Payment not found');
        return sendSuccess(res, payment, httpStatus.OK, 'Payment fetched successfully');
    } catch (err) { next(err); }
}

export async function handleStripeWebhook(req: Request, res: Response, next: NextFunction) {
    try {
        const sig = req.headers['stripe-signature'] as string;
        if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
            return sendError(res, httpStatus.INTERNAL_SERVER_ERROR, 'Stripe not configured');
        }

        const event = stripe.webhooks.constructEvent(req.body, sig, env.STRIPE_WEBHOOK_SECRET);

        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            const rentalRequestId = paymentIntent.metadata.rentalRequestId;
            const payment = await paymentService.findPaymentByRentalRequest(rentalRequestId);
            if (payment) {
                await paymentService.updatePaymentStatus(payment.id, 'completed', paymentIntent.id, paymentIntent.id);
            }
        }

        return sendSuccess(res, { received: true }, httpStatus.OK);
    } catch (err) { next(err); }
}