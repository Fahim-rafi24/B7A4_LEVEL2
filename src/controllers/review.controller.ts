import { Request, Response, NextFunction } from 'express';
import { createReviewSchema } from '../validators/review.validator';
import * as reviewService from '../services/review.service';
import * as rentalService from '../services/rental.service';
import { sendSuccess, sendError } from '../utils/apiResponse.util';
import { httpStatus } from '../config/http_status';

export async function createReview(req: Request, res: Response, next: NextFunction) {
    try {
        const data = createReviewSchema.parse(req.body);

        const rentals = await rentalService.findUserRentals(req.user!.sub, 'tenant');
        const hasCompletedRental = rentals.some(
            r => r.propertyId === data.propertyId && (r.status === 'completed' || r.status === 'active')
        );
        if (!hasCompletedRental) {
            return sendError(res, httpStatus.BAD_REQUEST, 'You can only review properties after an active or completed rental');
        }

        const review = await reviewService.createReview(data, req.user!.sub);
        return sendSuccess(res, review, httpStatus.CREATED, 'Review created successfully');
    } catch (err) { next(err); }
}

export async function getPropertyReviews(req: Request, res: Response, next: NextFunction) {
    try {
        const reviews = await reviewService.findReviewsByProperty(req.params.propertyId as string);
        return sendSuccess(res, reviews, httpStatus.OK, 'Reviews fetched successfully');
    } catch (err) { next(err); }
}