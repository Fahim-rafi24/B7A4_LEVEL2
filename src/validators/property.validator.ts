import { z } from 'zod';

export const createPropertySchema = z.object({
    title: z.string().min(1, 'Title is required').max(200),
    description: z.string().min(1, 'Description is required'),
    location: z.string().min(1, 'Location is required'),
    price: z.number().positive('Price must be positive'),
    bedrooms: z.number().int().positive().optional(),
    bathrooms: z.number().int().positive().optional(),
    area: z.number().positive().optional(),
    amenities: z.array(z.string()).optional().default([]),
    images: z.array(z.string()).optional().default([]),
    categoryId: z.string().min(1, 'Category is required'),
});

export const updatePropertySchema = createPropertySchema.partial();