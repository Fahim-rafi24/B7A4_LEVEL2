"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRentalRequest = createRentalRequest;
exports.findRentalById = findRentalById;
exports.findUserRentals = findUserRentals;
exports.findLandlordRequests = findLandlordRequests;
exports.updateRentalStatus = updateRentalStatus;
exports.findAllRentalsAdmin = findAllRentalsAdmin;
const client_1 = require("../prisma/client");
async function createRentalRequest(data, tenantId) {
    return client_1.prisma.rentalRequest.create({
        data: {
            propertyId: data.propertyId,
            tenantId,
            moveInDate: data.moveInDate ? new Date(data.moveInDate) : undefined,
            message: data.message,
        },
        include: {
            property: { include: { category: true } },
            tenant: { select: { id: true, name: true, email: true, phone: true } },
        },
    });
}
async function findRentalById(id) {
    return client_1.prisma.rentalRequest.findUnique({
        where: { id },
        include: {
            property: { include: { category: true, landlord: { select: { id: true, name: true, email: true } } } },
            tenant: { select: { id: true, name: true, email: true, phone: true } },
            payment: true,
        },
    });
}
async function findUserRentals(userId, role) {
    const where = role === 'tenant' ? { tenantId: userId } : { property: { landlordId: userId } };
    return client_1.prisma.rentalRequest.findMany({
        where,
        include: {
            property: { include: { category: true } },
            tenant: { select: { id: true, name: true, email: true } },
            payment: true,
        },
        orderBy: { createdAt: 'desc' },
    });
}
async function findLandlordRequests(landlordId) {
    return client_1.prisma.rentalRequest.findMany({
        where: { property: { landlordId } },
        include: {
            property: { include: { category: true } },
            tenant: { select: { id: true, name: true, email: true, phone: true } },
            payment: true,
        },
        orderBy: { createdAt: 'desc' },
    });
}
async function updateRentalStatus(id, landlordId, status, landlordNote) {
    return client_1.prisma.rentalRequest.update({
        where: { id, property: { landlordId } },
        data: { status: status, landlordNote },
        include: {
            property: true,
            tenant: { select: { id: true, name: true, email: true } },
        },
    });
}
async function findAllRentalsAdmin(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [rentals, total] = await Promise.all([
        client_1.prisma.rentalRequest.findMany({
            skip,
            take: limit,
            include: {
                property: true,
                tenant: { select: { id: true, name: true, email: true } },
                payment: true,
            },
            orderBy: { createdAt: 'desc' },
        }),
        client_1.prisma.rentalRequest.count(),
    ]);
    return { rentals, total, page, limit };
}
