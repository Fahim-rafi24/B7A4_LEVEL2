import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.util';
import { sendError } from '../utils/apiResponse.util';
import { rotateRefreshToken } from '../services/token.service';
import { env } from '../config/env';
import { httpStatus } from '../config/http_status';

export async function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        const accessToken = req.cookies?.accessToken;
        if (accessToken) {
            try {
                const payload = verifyAccessToken(accessToken);
                req.user = payload;
                return next();
            } catch {
                // access token expired/invalid → try refresh
            }
        }

        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return sendError(res, httpStatus.UNAUTHORIZED, 'No refresh token provided');
        }
        const tokens = await rotateRefreshToken(refreshToken);

        res.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: env.ACCESS_TOKEN_MAX_AGE,
        });
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: env.REFRESH_TOKEN_MAX_AGE,
        });

        const payload = verifyAccessToken(tokens.accessToken);
        req.user = payload;
        next();
    } catch {
        return sendError(res, httpStatus.UNAUTHORIZED, 'Invalid or expired refresh token');
    }
}