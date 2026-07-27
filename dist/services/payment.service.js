"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentRecord = createPaymentRecord;
exports.updatePaymentStatus = updatePaymentStatus;
exports.findPaymentById = findPaymentById;
exports.findUserPayments = findUserPayments;
exports.findPaymentByRentalRequest = findPaymentByRentalRequest;
const client_1 = require("../prisma/client");
async function createPaymentRecord(data) {
    return client_1.prisma.payment.create({
        data: {
            rentalRequestId: data.rentalRequestId,
            amount: data.amount,
            provider: data.provider,
            userId: data.userId,
            status: (data.status || 'pending'),
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
async function updatePaymentStatus(id, status, providerPaymentId, transactionId) {
    const data = { status: status };
    if (status === 'completed')
        data.paidAt = new Date();
    if (providerPaymentId)
        data.providerPaymentId = providerPaymentId;
    if (transactionId)
        data.transactionId = transactionId;
    return client_1.prisma.payment.update({ where: { id }, data });
}
async function findPaymentById(id) {
    return client_1.prisma.payment.findUnique({
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
async function findUserPayments(userId) {
    return client_1.prisma.payment.findMany({
        where: { userId },
        include: {
            rentalRequest: {
                include: { property: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
}
async function findPaymentByRentalRequest(rentalRequestId) {
    return client_1.prisma.payment.findUnique({ where: { rentalRequestId } });
}
