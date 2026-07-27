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
exports.createReview = createReview;
exports.getPropertyReviews = getPropertyReviews;
const review_validator_1 = require("../validators/review.validator");
const reviewService = __importStar(require("../services/review.service"));
const rentalService = __importStar(require("../services/rental.service"));
const apiResponse_util_1 = require("../utils/apiResponse.util");
const http_status_1 = require("../config/http_status");
async function createReview(req, res, next) {
    try {
        const data = review_validator_1.createReviewSchema.parse(req.body);
        const rentals = await rentalService.findUserRentals(req.user.sub, 'tenant');
        const hasCompletedRental = rentals.some(r => r.propertyId === data.propertyId && (r.status === 'completed' || r.status === 'active'));
        if (!hasCompletedRental) {
            return (0, apiResponse_util_1.sendError)(res, http_status_1.httpStatus.BAD_REQUEST, 'You can only review properties after an active or completed rental');
        }
        const review = await reviewService.createReview(data, req.user.sub);
        return (0, apiResponse_util_1.sendSuccess)(res, review, http_status_1.httpStatus.CREATED, 'Review created successfully');
    }
    catch (err) {
        next(err);
    }
}
async function getPropertyReviews(req, res, next) {
    try {
        const reviews = await reviewService.findReviewsByProperty(req.params.propertyId);
        return (0, apiResponse_util_1.sendSuccess)(res, reviews, http_status_1.httpStatus.OK, 'Reviews fetched successfully');
    }
    catch (err) {
        next(err);
    }
}
