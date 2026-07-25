import { z } from 'zod';

export const createRentalSchema = z.object({
    propertyId: z.string().min(1, 'Property ID is required'),
    moveInDate: z.string().optional(),
    message: z.string().optional(),
});

export const updateRentalStatusSchema = z.object({
    status: z.enum(['approved', 'rejected']),
    landlordNote: z.string().optional(),
});