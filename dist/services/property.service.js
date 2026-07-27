"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProperty = createProperty;
exports.updateProperty = updateProperty;
exports.deleteProperty = deleteProperty;
exports.findPropertyById = findPropertyById;
exports.findAllProperties = findAllProperties;
exports.findLandlordProperties = findLandlordProperties;
exports.findAllPropertiesAdmin = findAllPropertiesAdmin;
const client_1 = require("../prisma/client");
async function createProperty(data, landlordId) {
    return client_1.prisma.property.create({
        data: { ...data, landlordId },
        include: { category: true, landlord: { select: { id: true, name: true, email: true, phone: true } } },
    });
}
async function updateProperty(id, landlordId, data) {
    return client_1.prisma.property.update({
        where: { id, landlordId },
        data,
        include: { category: true },
    });
}
async function deleteProperty(id, landlordId) {
    return client_1.prisma.property.delete({ where: { id, landlordId } });
}
async function findPropertyById(id) {
    return client_1.prisma.property.findUnique({
        where: { id },
        include: {
            category: true,
            landlord: { select: { id: true, name: true, email: true, phone: true } },
            reviews: { include: { tenant: { select: { id: true, name: true } } } },
        },
    });
}
async function findAllProperties(filters) {
    const { search, location, minPrice, maxPrice, categoryId, status, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;
    const where = {};
    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }
    if (location)
        where.location = { contains: location, mode: 'insensitive' };
    if (minPrice !== undefined)
        where.price = { ...where.price, gte: minPrice };
    if (maxPrice !== undefined)
        where.price = { ...where.price, lte: maxPrice };
    if (categoryId)
        where.categoryId = categoryId;
    if (status)
        where.status = status;
    const [properties, total] = await Promise.all([
        client_1.prisma.property.findMany({
            where,
            skip,
            take: limit,
            include: { category: true, landlord: { select: { id: true, name: true } } },
            orderBy: { createdAt: 'desc' },
        }),
        client_1.prisma.property.count({ where }),
    ]);
    return { properties, total, page, limit };
}
async function findLandlordProperties(landlordId) {
    return client_1.prisma.property.findMany({
        where: { landlordId },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
    });
}
async function findAllPropertiesAdmin(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [properties, total] = await Promise.all([
        client_1.prisma.property.findMany({
            skip,
            take: limit,
            include: { category: true, landlord: { select: { id: true, name: true, email: true } } },
            orderBy: { createdAt: 'desc' },
        }),
        client_1.prisma.property.count(),
    ]);
    return { properties, total, page, limit };
}
