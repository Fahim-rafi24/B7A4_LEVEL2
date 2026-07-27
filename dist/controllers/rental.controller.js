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
exports.createRental = createRental;
exports.getUserRentals = getUserRentals;
exports.getRentalById = getRentalById;
exports.getLandlordRequests = getLandlordRequests;
exports.updateRentalStatus = updateRentalStatus;
const rental_validator_1 = require("../validators/rental.validator");
const rentalService = __importStar(require("../services/rental.service"));
const propertyService = __importStar(require("../services/property.service"));
const apiResponse_util_1 = require("../utils/apiResponse.util");
const http_status_1 = require("../config/http_status");
async function createRental(req, res, next) {
    try {
        const data = rental_validator_1.createRentalSchema.parse(req.body);
        const property = await propertyService.findPropertyById(data.propertyId);
        if (!property)
            return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.NOT_FOUND, 'Property not found');
        if (property.status !== 'available')
            return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.BAD_REQUEST, 'Property is not available');
        if (property.landlordId === req.user.sub)
            return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.BAD_REQUEST, 'You cannot rent your own property');
        const rental = await rentalService.createRentalRequest(data, req.user.sub);
        return (0, apiResponse_util_1.sendSuccess)(res, rental, http_status_1.httpStatus.CREATED, 'Rental request submitted successfully');
    }
    catch (err) {
        next(err);
    }
}
async function getUserRentals(req, res, next) {
    try {
        const rentals = await rentalService.findUserRentals(req.user.sub, req.user.role);
        return (0, apiResponse_util_1.sendSuccess)(res, rentals, http_status_1.httpStatus.OK, 'Rentals fetched successfully');
    }
    catch (err) {
        next(err);
    }
}
async function getRentalById(req, res, next) {
    try {
        const rental = await rentalService.findRentalById(req.params.id);
        if (!rental)
            return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.NOT_FOUND, 'Rental request not found');
        return (0, apiResponse_util_1.sendSuccess)(res, rental, http_status_1.httpStatus.OK, 'Rental fetched successfully');
    }
    catch (err) {
        next(err);
    }
}
async function getLandlordRequests(req, res, next) {
    try {
        const requests = await rentalService.findLandlordRequests(req.user.sub);
        return (0, apiResponse_util_1.sendSuccess)(res, requests, http_status_1.httpStatus.OK, 'Requests fetched successfully');
    }
    catch (err) {
        next(err);
    }
}
async function updateRentalStatus(req, res, next) {
    try {
        const { status, landlordNote } = rental_validator_1.updateRentalStatusSchema.parse(req.body);
        const rental = await rentalService.updateRentalStatus(req.params.id, req.user.sub, status, landlordNote);
        if (status === 'approved') {
            await propertyService.updateProperty(rental.propertyId, req.user.sub, { status: 'rented' });
        }
        return (0, apiResponse_util_1.sendSuccess)(res, rental, http_status_1.httpStatus.OK, `Rental request ${status} successfully`);
    }
    catch (err) {
        next(err);
    }
}
