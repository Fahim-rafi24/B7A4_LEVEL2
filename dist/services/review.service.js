"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = createReview;
exports.findReviewsByProperty = findReviewsByProperty;
const client_1 = require("../prisma/client");
async function createReview(data, tenantId) {
    return client_1.prisma.review.create({
        data: { ...data, tenantId },
        include: {
            tenant: { select: { id: true, name: true } },
            property: { select: { id: true, title: true } },
        },
    });
}
async function findReviewsByProperty(propertyId) {
    return client_1.prisma.review.findMany({
        where: { propertyId },
        include: { tenant: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
    });
}
