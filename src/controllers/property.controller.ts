import { Request, Response, NextFunction } from 'express';
import { createPropertySchema, updatePropertySchema } from '../validators/property.validator';
import * as propertyService from '../services/property.service';
import { sendSuccess, sendError } from '../utils/apiResponse.util';
import { httpStatus } from '../config/http_status';

export async function createProperty(req: Request, res: Response, next: NextFunction) {
    try {
        const data = createPropertySchema.parse(req.body);
        const property = await propertyService.createProperty(data, req.user!.sub);
        return sendSuccess(res, property, httpStatus.CREATED, 'Property created successfully');
    } catch (err) { next(err); }
}

export async function updateProperty(req: Request, res: Response, next: NextFunction) {
    try {
        const data = updatePropertySchema.parse(req.body);
        const property = await propertyService.updateProperty(req.params.id as string, req.user!.sub, data);
        return sendSuccess(res, property, httpStatus.OK, 'Property updated successfully');
    } catch (err) { next(err); }
}

export async function deleteProperty(req: Request, res: Response, next: NextFunction) {
    try {
        await propertyService.deleteProperty(req.params.id as string, req.user!.sub);
        return sendSuccess(res, null, httpStatus.OK, 'Property deleted successfully');
    } catch (err) { next(err); }
}

export async function getProperty(req: Request, res: Response, next: NextFunction) {
    try {
        const property = await propertyService.findPropertyById(req.params.id as string);
        if (!property) return sendError(res, httpStatus.NOT_FOUND, 'Property not found');
        return sendSuccess(res, property, httpStatus.OK, 'Property fetched successfully');
    } catch (err) { next(err); }
}

export async function getAllProperties(req: Request, res: Response, next: NextFunction) {
    try {
        const { search, location, minPrice, maxPrice, categoryId, status, page, limit } = req.query;
        const result = await propertyService.findAllProperties({
            search: search as string,
            location: location as string,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            categoryId: categoryId as string,
            status: status as string,
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 10,
        });
        return sendSuccess(res, result, httpStatus.OK, 'Properties fetched successfully');
    } catch (err) { next(err); }
}

export async function getLandlordProperties(req: Request, res: Response, next: NextFunction) {
    try {
        const properties = await propertyService.findLandlordProperties(req.user!.sub);
        return sendSuccess(res, properties, httpStatus.OK, 'Properties fetched successfully');
    } catch (err) { next(err); }
}