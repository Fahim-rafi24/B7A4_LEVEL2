import { prisma } from '../prisma/client';

export async function createPaymentRecord(data: {
    rentalRequestId: string;
    amount: number;
    provider: string;
    userId: string;
    status?: string;
    providerPaymentId?: string;
    transactionId?: string;
}) {
    return prisma.payment.create({
        data: {
            rentalRequestId: data.rentalRequestId,
            amount: data.amount,
            provider: data.provider as any,
            userId: data.userId,
            status: (data.status || 'pending') as any,
            providerPaymentId: data.providerPaymentId,
            transactionId: data.transactionId,
        },
        include: {
            rentalRequest: {
                include: {
                    property: true,
                    tenant: { select: { id: true, name: true, email: true } },
                },
            },
        },
    });
}

export async function updatePaymentStatus(id: string, status: string, providerPaymentId?: string, transactionId?: string) {
    const data: any = { status: status as any };
    if (status === 'completed') data.paidAt = new Date();
    if (providerPaymentId) data.providerPaymentId = providerPaymentId;
    if (transactionId) data.transactionId = transactionId;
    return prisma.payment.update({ where: { id }, data });
}

export async function findPaymentById(id: string) {
    return prisma.payment.findUnique({
        where: { id },
        include: {
            rentalRequest: {
                include: {
                    property: true,
                    tenant: { select: { id: true, name: true, email: true } },
                },
            },
        },
    });
}

export async function findUserPayments(userId: string) {
    return prisma.payment.findMany({
        where: { userId },
        include: {
            rentalRequest: {
                include: { property: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
}

export async function findPaymentByRentalRequest(rentalRequestId: string) {
    return prisma.payment.findUnique({ where: { rentalRequestId } });
}