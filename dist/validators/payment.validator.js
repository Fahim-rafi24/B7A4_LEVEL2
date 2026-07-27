"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentSchema = void 0;
const zod_1 = require("zod");
exports.createPaymentSchema = zod_1.z.object({
    rentalRequestId: zod_1.z.string().min(1, 'Rental request ID is required'),
    provider: zod_1.z.enum(['stripe', 'sslcommerz']),
});
