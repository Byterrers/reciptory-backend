export interface IJWTPayload {
    sub: string;
    email: string;
    iat?: Date;
}
