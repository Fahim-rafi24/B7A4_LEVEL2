"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
exports.findAllCategories = findAllCategories;
exports.findCategoryById = findCategoryById;
const client_1 = require("../prisma/client");
async function createCategory(name, description) {
    return client_1.prisma.category.create({ data: { name, description } });
}
async function updateCategory(id, data) {
    return client_1.prisma.category.update({ where: { id }, data });
}
async function deleteCategory(id) {
    return client_1.prisma.category.delete({ where: { id } });
}
async function findAllCategories() {
    return client_1.prisma.category.findMany({
        include: { _count: { select: { properties: true } } },
        orderBy: { name: 'asc' },
    });
}
async function findCategoryById(id) {
    return client_1.prisma.category.findUnique({ where: { id } });
}
