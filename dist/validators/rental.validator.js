"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRentalStatusSchema = exports.createRentalSchema = void 0;
const zod_1 = require("zod");
exports.createRentalSchema = zod_1.z.object({
    propertyId: zod_1.z.string().min(1, 'Property ID is required'),
    moveInDate: zod_1.z.string().optional(),
    message: zod_1.z.string().optional(),
});
exports.updateRentalStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['approved', 'rejected']),
    landlordNote: zod_1.z.string().optional(),
});
