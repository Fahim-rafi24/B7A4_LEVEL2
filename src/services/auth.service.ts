import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '../prisma/client';
import { env } from '../config/env';
import { hashPassword } from '../utils/hash.util';
import { UserStatus } from '@prisma/client';

export async function createUser(name: string, email: string, password: string, role?: string, phone?: string) {
    const hashed = await hashPassword(password);
    const data: any = { name, email, password: hashed };
    if (role) data.role = role as any;
    if (phone) data.phone = phone;
    return prisma.user.create({
        data,
        select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
    });
}

export async function findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id: string) {
    return prisma.user.findUnique({
        where: { id },
        select: { id: true, name: true, email: true, role: true, phone: true, status: true, createdAt: true, updatedAt: true },
    });
}

export async function getUserWithPassword(id: string) {
    return prisma.user.findUnique({ where: { id } });
}

export async function findAllUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
        prisma.user.findMany({
            skip,
            take: limit,
            select: { id: true, name: true, email: true, phone: true, role: true, status: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count(),
    ]);
    return { users, total, page, limit };
}

export async function updateUserStatus(id: string, status: string) {
    return prisma.user.update({
        where: { id },
        data: { status: status as UserStatus },
        select: { id: true, name: true, email: true, role: true, status: true },
    });
}

export function generateTokenId(): string {
    return crypto.randomUUID();
}

export async function hashToken(token: string): Promise<string> {
    return bcrypt.hash(token, env.BCRYPT_SALT_ROUNDS);
}

export async function compareToken(token: string, hash: string): Promise<boolean> {
    return bcrypt.compare(token, hash);
}

export async function storeRefreshToken(userId: string, tokenHash: string, expiresAt: Date) {
    return prisma.refreshToken.create({
        data: { userId, tokenHash, expiresAt },
    });
}

export async function findRefreshTokenById(token: string) {
    const tokenHash = token;
    return prisma.refreshToken.findUnique({ where: { tokenHash } });
}

export async function revokeRefreshToken(id: string) {
    return prisma.refreshToken.update({
        where: { id },
        data: { revoked: true },
    });
}