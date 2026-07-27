"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
exports.updateUserStatus = updateUserStatus;
exports.getAllProperties = getAllProperties;
exports.getAllRentals = getAllRentals;
const authService = __importStar(require("../services/auth.service"));
const propertyService = __importStar(require("../services/property.service"));
const rentalService = __importStar(require("../services/rental.service"));
const apiResponse_util_1 = require("../utils/apiResponse.util");
const http_status_1 = require("../config/http_status");
async function getAllUsers(req, res, next) {
    try {
        const { page, limit } = req.query;
        const result = await authService.findAllUsers(page ? Number(page) : 1, limit ? Number(limit) : 10);
        return (0, apiResponse_util_1.sendSuccess)(res, result, http_status_1.httpStatus.OK, 'Users fetched successfully');
    }
    catch (err) {
        next(err);
    }
}
async function updateUserStatus(req, res, next) {
    try {
        const { status } = req.body;
        if (!['active', 'banned'].includes(status)) {
            return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.BAD_REQUEST, 'Status must be active or banned');
        }
        const user = await authService.updateUserStatus(req.params.id, status);
        return (0, apiResponse_util_1.sendSuccess)(res, user, http_status_1.httpStatus.OK, `User ${status} successfully`);
    }
    catch (err) {
        next(err);
    }
}
async function getAllProperties(req, res, next) {
    try {
        const { page, limit } = req.query;
        const result = await propertyService.findAllPropertiesAdmin(page ? Number(page) : 1, limit ? Number(limit) : 10);
        return (0, apiResponse_util_1.sendSuccess)(res, result, http_status_1.httpStatus.OK, 'Properties fetched successfully');
    }
    catch (err) {
        next(err);
    }
}
async function getAllRentals(req, res, next) {
    try {
        const { page, limit } = req.query;
        const result = await rentalService.findAllRentalsAdmin(page ? Number(page) : 1, limit ? Number(limit) : 10);
        return (0, apiResponse_util_1.sendSuccess)(res, result, http_status_1.httpStatus.OK, 'Rental requests fetched successfully');
    }
    catch (err) {
        next(err);
    }
}
