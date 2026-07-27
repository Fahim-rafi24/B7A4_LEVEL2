"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = authorize;
const apiResponse_util_1 = require("../utils/apiResponse.util");
const http_status_1 = require("../config/http_status");
function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.UNAUTHORIZED, 'Not authenticated');
        }
        if (!roles.includes(req.user.role)) {
            return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.FORBIDDEN, 'Forbidden: insufficient permissions');
        }
        next();
    };
}
