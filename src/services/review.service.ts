import { prisma } from '../prisma/client';

export async function createReview(data: { propertyId: string; rating: number; comment?: string }, tenantId: string) {
    return prisma.review.create({
        data: { ...data, tenantId },
        include: {
            tenant: { select: { id: true, name: true } },
            property: { select: { id: true, title: true } },
        },
    });
}

export async function findReviewsByProperty(propertyId: string) {
    return prisma.review.findMany({
        where: { propertyId },
        include: { tenant: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
    });
}