import { prisma } from '../prisma/client';

export async function createRentalRequest(data: { propertyId: string; moveInDate?: string; message?: string }, tenantId: string) {
    return prisma.rentalRequest.create({
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

export async function findRentalById(id: string) {
    return prisma.rentalRequest.findUnique({
        where: { id },
        include: {
            property: { include: { category: true, landlord: { select: { id: true, name: true, email: true } } } },
            tenant: { select: { id: true, name: true, email: true, phone: true } },
            payment: true,
        },
    });
}

export async function findUserRentals(userId: string, role: string) {
    const where = role === 'tenant' ? { tenantId: userId } : { property: { landlordId: userId } };
    return prisma.rentalRequest.findMany({
        where,
        include: {
            property: { include: { category: true } },
            tenant: { select: { id: true, name: true, email: true } },
            payment: true,
        },
        orderBy: { createdAt: 'desc' },
    });
}

export async function findLandlordRequests(landlordId: string) {
    return prisma.rentalRequest.findMany({
        where: { property: { landlordId } },
        include: {
            property: { include: { category: true } },
            tenant: { select: { id: true, name: true, email: true, phone: true } },
            payment: true,
        },
        orderBy: { createdAt: 'desc' },
    });
}

export async function updateRentalStatus(id: string, landlordId: string, status: string, landlordNote?: string) {
    return prisma.rentalRequest.update({
        where: { id, property: { landlordId } },
        data: { status: status as any, landlordNote },
        include: {
            property: true,
            tenant: { select: { id: true, name: true, email: true } },
        },
    });
}

export async function findAllRentalsAdmin(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [rentals, total] = await Promise.all([
        prisma.rentalRequest.findMany({
            skip,
            take: limit,
            include: {
                property: true,
                tenant: { select: { id: true, name: true, email: true } },
                payment: true,
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.rentalRequest.count(),
    ]);
    return { rentals, total, page, limit };
}