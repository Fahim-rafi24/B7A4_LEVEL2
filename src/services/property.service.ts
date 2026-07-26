import { prisma } from '../prisma/client';

export async function createProperty(data: any, landlordId: string) {
    return prisma.property.create({
        data: { ...data, landlordId },
        include: { category: true, landlord: { select: { id: true, name: true, email: true, phone: true } } },
    });
}

export async function updateProperty(id: string, landlordId: string, data: any) {
    return prisma.property.update({
        where: { id, landlordId },
        data,
        include: { category: true },
    });
}

export async function deleteProperty(id: string, landlordId: string) {
    return prisma.property.delete({ where: { id, landlordId } });
}

export async function findPropertyById(id: string) {
    return prisma.property.findUnique({
        where: { id },
        include: {
            category: true,
            landlord: { select: { id: true, name: true, email: true, phone: true } },
            reviews: { include: { tenant: { select: { id: true, name: true } } } },
        },
    });
}

export async function findAllProperties(filters: {
    search?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    categoryId?: string;
    status?: string;
    page?: number;
    limit?: number;
}) {
    const { search, location, minPrice, maxPrice, categoryId, status, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (minPrice !== undefined) where.price = { ...where.price, gte: minPrice };
    if (maxPrice !== undefined) where.price = { ...where.price, lte: maxPrice };
    if (categoryId) where.categoryId = categoryId;
    if (status) where.status = status;

    const [properties, total] = await Promise.all([
        prisma.property.findMany({
            where,
            skip,
            take: limit,
            include: { category: true, landlord: { select: { id: true, name: true } } },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.property.count({ where }),
    ]);
    return { properties, total, page, limit };
}

export async function findLandlordProperties(landlordId: string) {
    return prisma.property.findMany({
        where: { landlordId },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
    });
}

export async function findAllPropertiesAdmin(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [properties, total] = await Promise.all([
        prisma.property.findMany({
            skip,
            take: limit,
            include: { category: true, landlord: { select: { id: true, name: true, email: true } } },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.property.count(),
    ]);
    return { properties, total, page, limit };
}