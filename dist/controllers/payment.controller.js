"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentIntent = createPaymentIntent;
exports.confirmPayment = confirmPayment;
exports.getUserPayments = getUserPayments;
exports.getPaymentById = getPaymentById;
exports.handleStripeWebhook = handleStripeWebhook;
const payment_validator_1 = require("../validators/payment.validator");
const paymentService = __importStar(require("../services/payment.service"));
const rentalService = __importStar(require("../services/rental.service"));
const apiResponse_util_1 = require("../utils/apiResponse.util");
const http_status_1 = require("../config/http_status");
const env_1 = require("../config/env");
let stripe = null;
try {
    if (env_1.env.STRIPE_SECRET_KEY) {
        stripe = new (require('stripe'))(env_1.env.STRIPE_SECRET_KEY);
    }
}
catch { /* stripe not installed */ }
async function createPaymentIntent(req, res, next) {
    try {
        const { rentalRequestId, provider } = payment_validator_1.createPaymentSchema.parse(req.body);
        const rental = await rentalService.findRentalById(rentalRequestId);
        if (!rental)
            return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.NOT_FOUND, 'Rental request not found');
        if (rental.tenantId !== req.user.sub)
            return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.FORBIDDEN, 'Not your rental request');
        if (rental.status !== 'approved')
            return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.BAD_REQUEST, 'Rental request is not approved yet');
        const existingPayment = await paymentService.findPaymentByRentalRequest(rentalRequestId);
        if (existingPayment && existingPayment.status === 'completed') {
            return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.BAD_REQUEST, 'Payment already completed');
        }
        if (provider === 'stripe') {
            if (!stripe) {
                // Fallback mock payment intent for testing
                const mockPayment = await paymentService.createPaymentRecord({
                    rentalRequestId,
                    amount: rental.property.price,
                    provider: 'stripe',
                    userId: req.user.sub,
                    status: 'pending',
                    providerPaymentId: `pi_mock_${Date.now()}`,
                });
                return (0, apiResponse_util_1.sendSuccess)(res, {
                    payment: mockPayment,
                    clientSecret: `pi_mock_${Date.now()}_secret_mock`,
                }, http_status_1.httpStatus.CREATED, 'Payment intent created (mock)');
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
                userId: req.user.sub,
                providerPaymentId: paymentIntent.id,
                status: 'pending',
            });
            return (0, apiResponse_util_1.sendSuccess)(res, {
                payment,
                clientSecret: paymentIntent.client_secret,
            }, http_status_1.httpStatus.CREATED, 'Payment intent created');
        }
        const payment = await paymentService.createPaymentRecord({
            rentalRequestId,
            amount: rental.property.price,
            provider: 'sslcommerz',
            userId: req.user.sub,
            status: 'pending',
        });
        return (0, apiResponse_util_1.sendSuccess)(res, { payment }, http_status_1.httpStatus.CREATED, 'Payment initiated');
    }
    catch (err) {
        next(err);
    }
}
async function confirmPayment(req, res, next) {
    try {
        const { paymentId, transactionId } = req.body;
        const payment = await paymentService.findPaymentById(paymentId);
        if (!payment)
            return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.NOT_FOUND, 'Payment not found');
        if (payment.userId !== req.user.sub)
            return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.FORBIDDEN, 'Not your payment');
        const updated = await paymentService.updatePaymentStatus(paymentId, 'completed', undefined, transactionId || `tx_${Date.now()}`);
        await rentalService.updateRentalStatus(payment.rentalRequestId, payment.rentalRequest.property.landlordId, 'active');
        return (0, apiResponse_util_1.sendSuccess)(res, updated, http_status_1.httpStatus.OK, 'Payment confirmed successfully');
    }
    catch (err) {
        next(err);
    }
}
async function getUserPayments(req, res, next) {
    try {
        const payments = await paymentService.findUserPayments(req.user.sub);
        return (0, apiResponse_util_1.sendSuccess)(res, payments, http_status_1.httpStatus.OK, 'Payments fetched successfully');
    }
    catch (err) {
        next(err);
    }
}
async function getPaymentById(req, res, next) {
    try {
        const payment = await paymentService.findPaymentById(req.params.id);
        if (!payment)
            return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.NOT_FOUND, 'Payment not found');
        return (0, apiResponse_util_1.sendSuccess)(res, payment, http_status_1.httpStatus.OK, 'Payment fetched successfully');
    }
    catch (err) {
        next(err);
    }
}
async function handleStripeWebhook(req, res, next) {
    try {
        const sig = req.headers['stripe-signature'];
        if (!stripe || !env_1.env.STRIPE_WEBHOOK_SECRET) {
            return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.INTERNAL_SERVER_ERROR, 'Stripe not configured');
        }
        const event = stripe.webhooks.constructEvent(req.body, sig, env_1.env.STRIPE_WEBHOOK_SECRET);
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            const rentalRequestId = paymentIntent.metadata.rentalRequestId;
            const payment = await paymentService.findPaymentByRentalRequest(rentalRequestId);
            if (payment) {
                await paymentService.updatePaymentStatus(payment.id, 'completed', paymentIntent.id, paymentIntent.id);
            }
        }
        return (0, apiResponse_util_1.sendSuccess)(res, { received: true }, http_status_1.httpStatus.OK);
    }
    catch (err) {
        next(err);
    }
}
