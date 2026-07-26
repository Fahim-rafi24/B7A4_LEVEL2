import { Request, Response, NextFunction } from 'express';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator';
import * as categoryService from '../services/category.service';
import { sendSuccess, sendError } from '../utils/apiResponse.util';
import { httpStatus } from '../config/http_status';

export async function createCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, description } = createCategorySchema.parse(req.body);
        const category = await categoryService.createCategory(name, description);
        return sendSuccess(res, category, httpStatus.CREATED, 'Category created successfully');
    } catch (err) { next(err); }
}

export async function updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const data = updateCategorySchema.parse(req.body);
        const category = await categoryService.updateCategory(req.params.id as string, data);
        return sendSuccess(res, category, httpStatus.OK, 'Category updated successfully');
    } catch (err) { next(err); }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
        await categoryService.deleteCategory(req.params.id as string);
        return sendSuccess(res, null, httpStatus.OK, 'Category deleted successfully');
    } catch (err) { next(err); }
}

export async function getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
        const categories = await categoryService.findAllCategories();
        return sendSuccess(res, categories, httpStatus.OK, 'Categories fetched successfully');
    } catch (err) { next(err); }
}