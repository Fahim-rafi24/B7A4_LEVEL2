import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse.util';
import { httpStatus } from '../config/http_status';

export function authorize(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return sendError(res, httpStatus.UNAUTHORIZED, 'Not authenticated');
        }
        if (!roles.includes(req.user.role)) {
            return sendError(res, httpStatus.FORBIDDEN, 'Forbidden: insufficient permissions');
        }
        next();
    };
}