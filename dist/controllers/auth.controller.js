"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
exports.login = login;
exports.refresh = refresh;
exports.logout = logout;
exports.getProfile = getProfile;
const auth_validator_1 = require("../validators/auth.validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const hash_util_1 = require("../utils/hash.util");
const auth_service_1 = require("../services/auth.service");
const token_service_1 = require("../services/token.service");
const apiResponse_util_1 = require("../utils/apiResponse.util");
const env_1 = require("../config/env");
const http_status_1 = require("../config/http_status");
async function signup(req, res, next) {
    try {
        const { name, email, password, role, phone } = auth_validator_1.signupSchema.parse(req.body);
        const existing = await (0, auth_service_1.findUserByEmail)(email);
        if (existing) {
            return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.CONFLICT, 'Email already registered');
        }
        const user = await (0, auth_service_1.createUser)(name, email, password, role, phone);
        const tokens = await (0, token_service_1.issueTokenPair)(user.id, user.role);
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
        return (0, apiResponse_util_1.sendSuccess)(res, { user, accessToken: tokens.accessToken }, http_status_1.httpStatus.CREATED, 'Signup successful');
    }
    catch (err) {
        next(err);
    }
}
;
async function login(req, res, next) {
    try {
        const { email, password } = auth_validator_1.loginSchema.parse(req.body);
        const user = await (0, auth_service_1.findUserByEmail)(email);
        if (!user) {
            return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.UNAUTHORIZED, 'Invalid email');
        }
        if (user.status === 'banned') {
            return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.FORBIDDEN, 'Your account has been banned');
        }
        const valid = await (0, hash_util_1.comparePassword)(password, user.password);
        if (!valid) {
            return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.UNAUTHORIZED, 'Invalid password');
        }
        const tokens = await (0, token_service_1.issueTokenPair)(user.id, user.role);
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
        const { password: _, ...safeUser } = user;
        return (0, apiResponse_util_1.sendSuccess)(res, { user: safeUser }, http_status_1.httpStatus.OK, 'Login successful');
    }
    catch (err) {
        next(err);
    }
}
;
async function refresh(req, res, next) {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) {
            return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.UNAUTHORIZED, 'No refresh token provided');
        }
        const tokens = await (0, token_service_1.rotateRefreshToken)(token);
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
        return (0, apiResponse_util_1.sendSuccess)(res, { accessToken: tokens.accessToken }, http_status_1.httpStatus.OK, 'Token refreshed');
    }
    catch (err) {
        next(err);
    }
}
;
async function logout(req, res, next) {
    try {
        const token = req.cookies?.refreshToken;
        if (token) {
            const decoded = jsonwebtoken_1.default.decode(token);
            const jti = decoded?.jti;
            if (jti) {
                const stored = await (0, auth_service_1.findRefreshTokenById)(jti);
                if (stored && !stored.revoked) {
                    await (0, auth_service_1.revokeRefreshToken)(jti);
                }
            }
        }
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: env_1.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: env_1.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        return (0, apiResponse_util_1.sendSuccess)(res, null, http_status_1.httpStatus.OK, 'Logged out successfully');
    }
    catch (err) {
        next(err);
    }
}
;
async function getProfile(req, res, next) {
    try {
        const user = await (0, auth_service_1.findUserById)(req.user.sub);
        if (!user) {
            return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.UNAUTHORIZED, 'User not found');
        }
        return (0, apiResponse_util_1.sendSuccess)(res, user, http_status_1.httpStatus.OK, 'Profile fetched');
    }
    catch (err) {
        next(err);
    }
}
;
