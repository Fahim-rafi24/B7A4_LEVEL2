"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePropertySchema = exports.createPropertySchema = void 0;
const zod_1 = require("zod");
exports.createPropertySchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').max(200),
    description: zod_1.z.string().min(1, 'Description is required'),
    location: zod_1.z.string().min(1, 'Location is required'),
    price: zod_1.z.number().positive('Price must be positive'),
    bedrooms: zod_1.z.number().int().positive().optional(),
    bathrooms: zod_1.z.number().int().positive().optional(),
    area: zod_1.z.number().positive().optional(),
    amenities: zod_1.z.array(zod_1.z.string()).optional().default([]),
    images: zod_1.z.array(zod_1.z.string()).optional().default([]),
    categoryId: zod_1.z.string().min(1, 'Category is required'),
});
exports.updatePropertySchema = exports.createPropertySchema.partial();
