import dotenv from 'dotenv';
import path from 'path';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export const env: {
    NODE_ENV: string,
    PORT: number,
    DATABASE_URL: string,
    JWT_ACCESS_SECRET: string,
    JWT_REFRESH_SECRET: string,
    JWT_ACCESS_EXPIRY: string,
    JWT_REFRESH_EXPIRY: string,
    BCRYPT_SALT_ROUNDS: number,
    ACCESS_TOKEN_MAX_AGE: number,
    REFRESH_TOKEN_MAX_AGE: number,
    SITE_URL: string,
    URL_FILE_SIZE: string,
    MULTER_FILE_SIZE: number,
    STRIPE_SECRET_KEY: string,
    STRIPE_WEBHOOK_SECRET: string,
} = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),
    DATABASE_URL: process.env.DATABASE_URL || '',
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || '',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',
    JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '15m',
    JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',
    BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10),
    ACCESS_TOKEN_MAX_AGE: 900000,
    REFRESH_TOKEN_MAX_AGE: 604800000,
    SITE_URL: process.env.SITE_URL || "http://localhost:5173",
    URL_FILE_SIZE: process.env.URL_FILE_SIZE || "25mb",
    MULTER_FILE_SIZE: parseInt(process.env.MULTER_FILE_SIZE || '45', 10),
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
};