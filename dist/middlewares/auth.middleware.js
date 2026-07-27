"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jwt_util_1 = require("../utils/jwt.util");
const apiResponse_util_1 = require("../utils/apiResponse.util");
const token_service_1 = require("../services/token.service");
const env_1 = require("../config/env");
const http_status_1 = require("../config/http_status");
async function authenticate(req, res, next) {
    try {
        const accessToken = req.cookies?.accessToken;
        if (accessToken) {
            try {
                const payload = (0, jwt_util_1.verifyAccessToken)(accessToken);
                req.user = payload;
                return next();
            }
            catch {
                // access token expired/invalid → try refresh
            }
        }
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.UNAUTHORIZED, 'No refresh token provided');
        }
        const tokens = await (0, token_service_1.rotateRefreshToken)(refreshToken);
        res.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            secure: env_1.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: env_1.env.ACCESS_TOKEN_MAX_AGE,
        });
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: env_1.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: env_1.env.REFRESH_TOKEN_MAX_AGE,
        });
        const payload = (0, jwt_util_1.verifyAccessToken)(tokens.accessToken);
        req.user = payload;
        next();
    }
    catch {
        return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.UNAUTHORIZED, 'Invalid or expired refresh token');
    }
}
