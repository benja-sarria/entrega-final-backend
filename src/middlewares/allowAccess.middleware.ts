import { NextFunction, Request, Response } from "express";

export const allowAccess = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, DELETE"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
};
