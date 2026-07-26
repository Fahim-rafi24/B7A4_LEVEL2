import { Request, Response, NextFunction } from 'express';
import { signupSchema, loginSchema } from '../validators/auth.validator';
import jwt from 'jsonwebtoken';
import { comparePassword } from '../utils/hash.util';
import { createUser, findUserByEmail, findUserById, hashToken, findRefreshTokenById, revokeRefreshToken } from '../services/auth.service';
import { issueTokenPair, rotateRefreshToken } from '../services/token.service';
import { sendSuccess, sendError } from '../utils/apiResponse.util';
import { env } from '../config/env';
import { httpStatus } from '../config/http_status';

export async function signup(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, email, password, role, phone } = signupSchema.parse(req.body);

        const existing = await findUserByEmail(email);
        if (existing) {
            return sendError(res, httpStatus.CONFLICT, 'Email already registered');
        }

        const user = await createUser(name, email, password, role, phone);
        const tokens = await issueTokenPair(user.id, user.role);

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

        return sendSuccess(res, { user, accessToken: tokens.accessToken }, httpStatus.CREATED, 'Signup successful');
    } catch (err) {
        next(err);
    }
};

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await findUserByEmail(email);
        if (!user) {
            return sendError(res, httpStatus.UNAUTHORIZED, 'Invalid email');
        }

        if (user.status === 'banned') {
            return sendError(res, httpStatus.FORBIDDEN, 'Your account has been banned');
        }

        const valid = await comparePassword(password, user.password);
        if (!valid) {
            return sendError(res, httpStatus.UNAUTHORIZED, 'Invalid password');
        }

        const tokens = await issueTokenPair(user.id, user.role);

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

        const { password: _, ...safeUser } = user;
        return sendSuccess(res, { user: safeUser }, httpStatus.OK, 'Login successful');
    } catch (err) {
        next(err);
    }
};

export async function refresh(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) {
            return sendError(res, httpStatus.UNAUTHORIZED, 'No refresh token provided');
        }

        const tokens = await rotateRefreshToken(token);

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

        return sendSuccess(res, { accessToken: tokens.accessToken }, httpStatus.OK, 'Token refreshed');
    } catch (err) {
        next(err);
    }
};

export async function logout(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies?.refreshToken;
        if (token) {
            const decoded = jwt.decode(token) as { jti?: string } | null;
            const jti = decoded?.jti;
            if (jti) {
                const stored = await findRefreshTokenById(jti);
                if (stored && !stored.revoked) {
                    await revokeRefreshToken(jti);
                }
            }
        }

        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        return sendSuccess(res, null, httpStatus.OK, 'Logged out successfully');
    } catch (err) {
        next(err);
    }
};

export async function getProfile(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await findUserById(req.user!.sub);
        if (!user) {
            return sendError(res, httpStatus.UNAUTHORIZED, 'User not found');
        }
        return sendSuccess(res, user, httpStatus.OK, 'Profile fetched');
    } catch (err) {
        next(err);
    }
};