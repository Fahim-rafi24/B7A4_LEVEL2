import { Request, Response, NextFunction } from 'express';
import { createRentalSchema, updateRentalStatusSchema } from '../validators/rental.validator';
import * as rentalService from '../services/rental.service';
import * as propertyService from '../services/property.service';
import { sendSuccess, sendError } from '../utils/apiResponse.util';
import { httpStatus } from '../config/http_status';

export async function createRental(req: Request, res: Response, next: NextFunction) {
    try {
        const data = createRentalSchema.parse(req.body);
        const property = await propertyService.findPropertyById(data.propertyId);
        if (!property) return sendError(res, httpStatus.NOT_FOUND, 'Property not found');
        if (property.status !== 'available') return sendError(res, httpStatus.BAD_REQUEST, 'Property is not available');
        if (property.landlordId === req.user!.sub) return sendError(res, httpStatus.BAD_REQUEST, 'You cannot rent your own property');
        const rental = await rentalService.createRentalRequest(data, req.user!.sub);
        return sendSuccess(res, rental, httpStatus.CREATED, 'Rental request submitted successfully');
    } catch (err) { next(err); }
}

export async function getUserRentals(req: Request, res: Response, next: NextFunction) {
    try {
        const rentals = await rentalService.findUserRentals(req.user!.sub, req.user!.role);
        return sendSuccess(res, rentals, httpStatus.OK, 'Rentals fetched successfully');
    } catch (err) { next(err); }
}

export async function getRentalById(req: Request, res: Response, next: NextFunction) {
    try {
        const rental = await rentalService.findRentalById(req.params.id as string);
        if (!rental) return sendError(res, httpStatus.NOT_FOUND, 'Rental request not found');
        return sendSuccess(res, rental, httpStatus.OK, 'Rental fetched successfully');
    } catch (err) { next(err); }
}

export async function getLandlordRequests(req: Request, res: Response, next: NextFunction) {
    try {
        const requests = await rentalService.findLandlordRequests(req.user!.sub);
        return sendSuccess(res, requests, httpStatus.OK, 'Requests fetched successfully');
    } catch (err) { next(err); }
}

export async function updateRentalStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const { status, landlordNote } = updateRentalStatusSchema.parse(req.body);
        const rental = await rentalService.updateRentalStatus(req.params.id as string, req.user!.sub, status, landlordNote);
        if (status === 'approved') {
            await propertyService.updateProperty(rental.propertyId, req.user!.sub, { status: 'rented' });
        }
        return sendSuccess(res, rental, httpStatus.OK, `Rental request ${status} successfully`);
    } catch (err) { next(err); }
}