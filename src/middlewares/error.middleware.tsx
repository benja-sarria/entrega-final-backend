import { NextFunction, Request, Response } from "express";
import { apiFailedResponse } from "../utils/api/api.utils";
import { CustomError } from "../utils/errors/customError";
import ReactDOMServer from "react-dom/server";
import ReactApp from "../client/App";

export const errorMiddleware = (
    error: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log(error);
    const status = error.status || 500;
    const errorItem = {
        message: error.message,
        details: error.details,
    };
    const errorResponse = apiFailedResponse(errorItem, status);

    return res.status(status).send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css" rel="stylesheet">
        <title>Entrega n° 23</title>
    </head>
    <body >
        <div id="root">${ReactDOMServer.renderToString(
            <ReactApp type={"error"} errorResponse={errorResponse} />
        )}
        </div>
    </body>
    </html>`);
};
