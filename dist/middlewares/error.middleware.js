"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const jsonwebtoken_1 = require("jsonwebtoken");
const apiResponse_util_1 = require("../utils/apiResponse.util");
const env_1 = require("../config/env");
const http_status_1 = require("../config/http_status");
function errorHandler(err, _req, res, _next) {
    if (err instanceof zod_1.ZodError) {
        const messages = err.issues.map((e) => `${e.path.join('.')}: ${e.message}`);
        return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.BAD_REQUEST, 'Validation failed', messages);
    }
    if (err instanceof jsonwebtoken_1.TokenExpiredError) {
        return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.UNAUTHORIZED, 'Token expired');
    }
    if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
        return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.UNAUTHORIZED, 'Invalid token');
    }
    if (err.message === 'Invalid or revoked refresh token' || err.message === 'Refresh token mismatch') {
        return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.UNAUTHORIZED, err.message);
    }
    if (env_1.env.NODE_ENV === 'development') {
        console.error('Unhandled error:', err);
    }
    return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
}
