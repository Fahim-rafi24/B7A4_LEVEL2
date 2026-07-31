import { z } from 'zod';

const roleEnum = z.enum(['tenant', 'landlord', 'admin']);

export const signupSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    email: z.string().email('Invalid email format'),
    password: z.string().regex(
        /^(?=(?:.*\d){2,})(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
        "Password must contain at least 8 characters, 2 numbers, and 1 special character"
    ),
    role: roleEnum.optional().default('tenant'),
    phone: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});