import { prisma } from '../prisma/client';

export async function createCategory(name: string, description?: string) {
    return prisma.category.create({ data: { name, description } });
}

export async function updateCategory(id: string, data: { name?: string; description?: string }) {
    return prisma.category.update({ where: { id }, data });
}

export async function deleteCategory(id: string) {
    return prisma.category.delete({ where: { id } });
}

export async function findAllCategories() {
    return prisma.category.findMany({
        include: { _count: { select: { properties: true } } },
        orderBy: { name: 'asc' },
    });
}

export async function findCategoryById(id: string) {
    return prisma.category.findUnique({ where: { id } });
}