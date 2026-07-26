import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import * as propertyService from '../services/property.service';
import * as rentalService from '../services/rental.service';
import { sendSuccess, sendError } from '../utils/apiResponse.util';
import { httpStatus } from '../config/http_status';

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const { page, limit } = req.query;
        const result = await authService.findAllUsers(
            page ? Number(page) : 1,
            limit ? Number(limit) : 10
        );
        return sendSuccess(res, result, httpStatus.OK, 'Users fetched successfully');
    } catch (err) { next(err); }
}

export async function updateUserStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const { status } = req.body;
        if (!['active', 'banned'].includes(status)) {
            return sendError(res, httpStatus.BAD_REQUEST, 'Status must be active or banned');
        }
        const user = await authService.updateUserStatus(req.params.id as string, status);
        return sendSuccess(res, user, httpStatus.OK, `User ${status} successfully`);
    } catch (err) { next(err); }
}

export async function getAllProperties(req: Request, res: Response, next: NextFunction) {
    try {
        const { page, limit } = req.query;
        const result = await propertyService.findAllPropertiesAdmin(
            page ? Number(page) : 1,
            limit ? Number(limit) : 10
        );
        return sendSuccess(res, result, httpStatus.OK, 'Properties fetched successfully');
    } catch (err) { next(err); }
}

export async function getAllRentals(req: Request, res: Response, next: NextFunction) {
    try {
        const { page, limit } = req.query;
        const result = await rentalService.findAllRentalsAdmin(
            page ? Number(page) : 1,
            limit ? Number(limit) : 10
        );
        return sendSuccess(res, result, httpStatus.OK, 'Rental requests fetched successfully');
    } catch (err) { next(err); }
}