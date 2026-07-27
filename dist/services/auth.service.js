"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.findUserByEmail = findUserByEmail;
exports.findUserById = findUserById;
exports.getUserWithPassword = getUserWithPassword;
exports.findAllUsers = findAllUsers;
exports.updateUserStatus = updateUserStatus;
exports.generateTokenId = generateTokenId;
exports.hashToken = hashToken;
exports.compareToken = compareToken;
exports.storeRefreshToken = storeRefreshToken;
exports.findRefreshTokenById = findRefreshTokenById;
exports.revokeRefreshToken = revokeRefreshToken;
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("../prisma/client");
const env_1 = require("../config/env");
const hash_util_1 = require("../utils/hash.util");
async function createUser(name, email, password, role, phone) {
    const hashed = await (0, hash_util_1.hashPassword)(password);
    const data = { name, email, password: hashed };
    if (role)
        data.role = role;
    if (phone)
        data.phone = phone;
    return client_1.prisma.user.create({
        data,
        select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
    });
}
async function findUserByEmail(email) {
    return client_1.prisma.user.findUnique({ where: { email } });
}
async function findUserById(id) {
    return client_1.prisma.user.findUnique({
        where: { id },
        select: { id: true, name: true, email: true, role: true, phone: true, status: true, createdAt: true, updatedAt: true },
    });
}
async function getUserWithPassword(id) {
    return client_1.prisma.user.findUnique({ where: { id } });
}
async function findAllUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
        client_1.prisma.user.findMany({
            skip,
            take: limit,
            select: { id: true, name: true, email: true, phone: true, role: true, status: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
        }),
        client_1.prisma.user.count(),
    ]);
    return { users, total, page, limit };
}
async function updateUserStatus(id, status) {
    return client_1.prisma.user.update({
        where: { id },
        data: { status: status },
        select: { id: true, name: true, email: true, role: true, status: true },
    });
}
function generateTokenId() {
    return crypto_1.default.randomUUID();
}
async function hashToken(token) {
    return bcryptjs_1.default.hash(token, env_1.env.BCRYPT_SALT_ROUNDS);
}
async function compareToken(token, hash) {
    return bcryptjs_1.default.compare(token, hash);
}
async function storeRefreshToken(userId, tokenHash, expiresAt) {
    return client_1.prisma.refreshToken.create({
        data: { userId, tokenHash, expiresAt },
    });
}
async function findRefreshTokenById(token) {
    const tokenHash = token;
    return client_1.prisma.refreshToken.findUnique({ where: { tokenHash } });
}
async function revokeRefreshToken(id) {
    return client_1.prisma.refreshToken.update({
        where: { id },
        data: { revoked: true },
    });
}
