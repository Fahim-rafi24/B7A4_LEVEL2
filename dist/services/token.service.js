"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.issueTokenPair = issueTokenPair;
exports.rotateRefreshToken = rotateRefreshToken;
const env_1 = require("../config/env");
const jwt_util_1 = require("../utils/jwt.util");
const auth_service_1 = require("./auth.service");
async function issueTokenPair(userId, role) {
    const jti = (0, auth_service_1.generateTokenId)();
    const accessPayload = { sub: userId, role };
    const refreshPayload = { sub: userId, jti };
    const accessToken = (0, jwt_util_1.signAccessToken)(accessPayload);
    const refreshToken = (0, jwt_util_1.signRefreshToken)(refreshPayload);
    const tokenHash = refreshToken;
    const expiresAt = new Date(Date.now() + env_1.env.REFRESH_TOKEN_MAX_AGE);
    await (0, auth_service_1.storeRefreshToken)(userId, tokenHash, expiresAt);
    return { accessToken, refreshToken };
}
async function rotateRefreshToken(oldRefreshToken) {
    const payload = (0, jwt_util_1.verifyRefreshToken)(oldRefreshToken);
    const stored = await (0, auth_service_1.findRefreshTokenById)(oldRefreshToken);
    if (!stored || stored.revoked !== false) {
        throw new Error('Invalid or revoked refresh token');
    }
    if (oldRefreshToken !== stored.tokenHash) {
        throw new Error('Refresh token mismatch');
    }
    await (0, auth_service_1.revokeRefreshToken)(stored.id);
    return issueTokenPair(payload.sub, 'user');
}
