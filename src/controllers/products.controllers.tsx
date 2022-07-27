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

export class ProductControllers {
    service: ProductServices;
    constructor() {
        this.service = new ProductServices(
            DAOSFactory.getDAOS(env.DATA_SOURCE).productDao
        );
        this.getProductsController = this.getProductsController.bind(this);
        this.getProductsByIdController =
            this.getProductsByIdController.bind(this);
        this.createProductController = this.createProductController.bind(this);
        this.updateProductController = this.updateProductController.bind(this);
        this.deleteProductController = this.deleteProductController.bind(this);
    }
    async getProductsController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const products = await this.service.getProductsService();
            const response = apiSuccessResponse(products, STATUS.OK);
            return res.status(STATUS.OK).json(response);
        } catch (error) {
            next(error);
        }
    }
    async getProductsByIdController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;
            const product = await this.service.getProductByIdService(id);
            const response = apiSuccessResponse(product, STATUS.OK);
            return res.status(STATUS.OK).json(response);
        } catch (error) {
            next(error);
        }
    }
    async getProductsByCategoryController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { category } = req.params;
            const product = await this.service.getProductByCategoryService(
                category
            );
            const response = apiSuccessResponse(product, STATUS.OK);
            return res.status(STATUS.OK).json(response);
        } catch (error) {
            next(error);
        }
    }
    async createProductController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { params, body } = req;
            const productToAdd = req.body;
            const createdProduct = await this.service.createProductService(
                productToAdd
            );
            console.log("[CREATED-PRODUCT] => ", createdProduct);

            const response = apiSuccessResponse(createdProduct, STATUS.CREATED);
            return res.status(STATUS.CREATED).json(response);
        } catch (error) {
            next(error);
        }
    }
    async updateProductController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { params, body } = req;
            const { id } = params;
            const productToUpdate = body;
            const updatedProduct = await this.service.updateProductService(
                id,
                productToUpdate
            );
            const response = apiSuccessResponse(updatedProduct, STATUS.CREATED);
            return res.status(STATUS.CREATED).json(response);
        } catch (error) {
            next(error);
        }
    }
    async deleteProductController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;
            const deletedProduct = await this.service.deleteProductService(id);
            const response = apiSuccessResponse(deletedProduct, STATUS.OK);
            return res.status(STATUS.OK).json(response);
        } catch (error) {
            next(error);
        }
    }

    async productCreationPageController(
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
                        <ReactApp type={"product"} />
                    )}
                    </div>
                </body>
                </html>`);
        } catch (error) {
            next(error);
        }
    }
}
