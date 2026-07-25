import { z } from 'zod';

export const createPaymentSchema = z.object({
    rentalRequestId: z.string().min(1, 'Rental request ID is required'),
    provider: z.enum(['stripe', 'sslcommerz']),
});