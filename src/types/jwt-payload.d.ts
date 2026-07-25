export interface JwtAccessPayload {
    sub: string;
    role: string;
}

export interface JwtRefreshPayload {
    sub: string;
    jti: string;
}