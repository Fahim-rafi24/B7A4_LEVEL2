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
exports.createProperty = createProperty;
exports.updateProperty = updateProperty;
exports.deleteProperty = deleteProperty;
exports.getProperty = getProperty;
exports.getAllProperties = getAllProperties;
exports.getLandlordProperties = getLandlordProperties;
const property_validator_1 = require("../validators/property.validator");
const propertyService = __importStar(require("../services/property.service"));
const apiResponse_util_1 = require("../utils/apiResponse.util");
const http_status_1 = require("../config/http_status");
async function createProperty(req, res, next) {
    try {
        const data = property_validator_1.createPropertySchema.parse(req.body);
        const property = await propertyService.createProperty(data, req.user.sub);
        return (0, apiResponse_util_1.sendSuccess)(res, property, http_status_1.httpStatus.CREATED, 'Property created successfully');
    }
    catch (err) {
        next(err);
    }
}
async function updateProperty(req, res, next) {
    try {
        const data = property_validator_1.updatePropertySchema.parse(req.body);
        const property = await propertyService.updateProperty(req.params.id, req.user.sub, data);
        return (0, apiResponse_util_1.sendSuccess)(res, property, http_status_1.httpStatus.OK, 'Property updated successfully');
    }
    catch (err) {
        next(err);
    }
}
async function deleteProperty(req, res, next) {
    try {
        await propertyService.deleteProperty(req.params.id, req.user.sub);
        return (0, apiResponse_util_1.sendSuccess)(res, null, http_status_1.httpStatus.OK, 'Property deleted successfully');
    }
    catch (err) {
        next(err);
    }
}
async function getProperty(req, res, next) {
    try {
        const property = await propertyService.findPropertyById(req.params.id);
        if (!property)
            return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.NOT_FOUND, 'Property not found');
        return (0, apiResponse_util_1.sendSuccess)(res, property, http_status_1.httpStatus.OK, 'Property fetched successfully');
    }
    catch (err) {
        next(err);
    }
}
async function getAllProperties(req, res, next) {
    try {
        const { search, location, minPrice, maxPrice, categoryId, status, page, limit } = req.query;
        const result = await propertyService.findAllProperties({
            search: search,
            location: location,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            categoryId: categoryId,
            status: status,
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 10,
        });
        return (0, apiResponse_util_1.sendSuccess)(res, result, http_status_1.httpStatus.OK, 'Properties fetched successfully');
    }
    catch (err) {
        next(err);
    }
}
async function getLandlordProperties(req, res, next) {
    try {
        const properties = await propertyService.findLandlordProperties(req.user.sub);
        return (0, apiResponse_util_1.sendSuccess)(res, properties, http_status_1.httpStatus.OK, 'Properties fetched successfully');
    }
    catch (err) {
        next(err);
    }
}
