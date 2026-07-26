import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { sendError } from '../utils/apiResponse.util';
import { env } from '../config/env';
import { httpStatus } from '../config/http_status';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof ZodError) {
        const messages = err.issues.map((e: { path: PropertyKey[]; message: string }) => `${e.path.join('.')}: ${e.message}`);
        return sendError(res, httpStatus.BAD_REQUEST, 'Validation failed', messages);
    }

    if (err instanceof TokenExpiredError) {
        return sendError(res, httpStatus.UNAUTHORIZED, 'Token expired');
    }

    if (err instanceof JsonWebTokenError) {
        return sendError(res, httpStatus.UNAUTHORIZED, 'Invalid token');
    }

    if (err.message === 'Invalid or revoked refresh token' || err.message === 'Refresh token mismatch') {
        return sendError(res, httpStatus.UNAUTHORIZED, err.message);
    }

    if (env.NODE_ENV === 'development') {
        console.error('Unhandled error:', err);
    }

    return sendError(res, httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
}