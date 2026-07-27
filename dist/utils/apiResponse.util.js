"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendError = sendError;
function sendSuccess(res, data, statusCode = 200, message) {
    return res.status(statusCode).json({
        statusCode,
        success: statusCode < 400 ? true : false,
        message: message || 'Request successful',
        data,
    });
}
function sendError(res, statusCode, message, errors) {
    return res.status(statusCode).json({
        statusCode,
        success: false,
        message,
        errors: errors || undefined,
    });
}
