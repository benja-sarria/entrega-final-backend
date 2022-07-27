import { ProductServices } from "../services/products/products.services";
import { STATUS } from "../utils/constants/api.constants";
import { apiSuccessResponse, apiFailedResponse } from "../utils/api/api.utils";
import { DAOSFactory } from "../models/daos/daos.factory";
import { env } from "../config/config";
import { ProductInterface } from "../interfaces/ProductsDaoInterface";
import React from "react";
import ReactDOM from "react-dom";
import ReactApp from "../client/App";
import ReactDOMServer from "react-dom/server";
import { NextFunction, Request, Response } from "express";

export class ClientControllers {
    constructor() {
        this.homeScreenController = this.homeScreenController.bind(this);
    }

    async homeScreenController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            res.send(`<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <link href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css" rel="stylesheet">
                    <title>Entrega n° 23</title>
                </head>
                <body >
                    <div id="root">${ReactDOMServer.renderToString(
                        <ReactApp type={"homeScreen"} />
                    )}
                    </div>
                </body>
                </html>`);
        } catch (error) {
            next(error);
        }
    }
}
