import { STATUS } from "../utils/constants/api.constants";
import { apiSuccessResponse, apiFailedResponse } from "../utils/api/api.utils";
import { DAOSFactory } from "../models/daos/daos.factory";
import { env } from "../config/config";
import { NextFunction, Request, Response } from "express";
import { CartServices } from "../services/carts/carts.services";
import jwt from "jsonwebtoken";
import { CustomError } from "../utils/errors/customError";
import nodemailer from "nodemailer";
import { UsersInterface } from "../interfaces/UsersInterface";
import ReactDOMServer from "react-dom/server";
import ReactApp from "../client/App";
import { OrderServices } from "../services/orders/orders.services";
import { ProductInterface } from "../interfaces/ProductsDaoInterface";

export class CartControllers {
    service: CartServices;
    constructor() {
        this.service = new CartServices(
            DAOSFactory.getDAOS(env.DATA_SOURCE).cartDao
        );

        this.getCartByIdController = this.getCartByIdController.bind(this);
        this.createCartController = this.createCartController.bind(this);
        this.updateCartController = this.updateCartController.bind(this);
        this.deleteCartController = this.deleteCartController.bind(this);
        this.searchCartController = this.searchCartController.bind(this);
        this.checkoutCartController = this.checkoutCartController.bind(this);
    }

    async getCartByIdController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;
            const cart = await this.service.getCartByIdService(id);
            const response = apiSuccessResponse(cart, STATUS.OK);
            return res.status(STATUS.OK).json(response);
        } catch (error) {
            next(error);
        }
    }
    async searchCartController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const token = req.cookies.user;
            if (token) {
                const decoded = jwt.verify(token, env.JWT_SECRET) as any;

                const existingCart =
                    await this.service.searchCartByUserIdService(
                        decoded.user._id
                    );

                console.log("[EXISTING-CART] => ", existingCart);
                if (!existingCart) {
                    return res
                        .status(STATUS.NOT_FOUND)
                        .send(new CustomError(STATUS.NOT_FOUND, "Not found"));
                }
                const response = apiSuccessResponse(
                    existingCart,
                    STATUS.CREATED
                );
                return res.status(STATUS.CREATED).json(response);
            } else {
                return res
                    .status(STATUS.SERV_ERROR)
                    .json({ message: "You must be logged in" });
            }
        } catch (error) {
            next(error);
        }
    }
    async createCartController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            console.log("[CREANDO-CART] => ", req.cookies);
            const token = req.cookies.user;
            if (token) {
                const decoded = jwt.verify(token, env.JWT_SECRET) as any;

                const newCart = {
                    userId: decoded.user._id,
                    products: [],
                };
                const createdCart = await this.service.createCartService(
                    newCart
                );
                console.log("[CREATED-PRODUCT] => ", createdCart);

                const response = apiSuccessResponse(
                    createdCart,
                    STATUS.CREATED
                );
                return res.status(STATUS.CREATED).json(response);
            } else {
                return res
                    .status(STATUS.SERV_ERROR)
                    .json({ message: "You must be logged in" });
            }
        } catch (error) {
            next(error);
        }
    }
    async updateCartController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { params, body } = req;
            const { id } = params;
            const cartToUpdate = body;
            console.log("[CART-TO-UPDATE] => ", req.body);
            console.log("[CART-TO-UPDATE] => ", req.params);

            const updatedCart = await this.service.updateCartService(
                id,
                cartToUpdate
            );
            const response = apiSuccessResponse(updatedCart, STATUS.CREATED);
            return res.status(STATUS.CREATED).json(response);
        } catch (error) {
            next(error);
        }
    }

    async checkoutCartController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            if (req.user) {
                const currentUser = req.user as UsersInterface;
                const { params, body } = req;
                const { id } = params;
                const actualCart = await this.service.getCartByIdService(id);
                if (actualCart) {
                    try {
                        const orderService = new OrderServices(
                            DAOSFactory.getDAOS(env.DATA_SOURCE).ordersDao
                        );
                        const currentNumber =
                            await orderService.getOrdersAmountService();
                        console.log("[CURRENT-NUMBER] => ", currentNumber);

                        const orderNumber = +currentNumber.length
                            ? +currentNumber.length + 1
                            : 0 + 1;
                        const orderToAdd = {
                            id: orderNumber,
                            email: currentUser.email,
                            products: actualCart.products as ProductInterface[],
                            status: "generated",
                            createdAt: Date.now(),
                        };
                        const newOrder = await orderService.createOrderService(
                            orderToAdd
                        );
                        console.log(newOrder);

                        const transporter = nodemailer.createTransport({
                            service: "gmail",
                            auth: {
                                user: env.GMAIL_USER,
                                pass: env.GMAIL_PASSWORD,
                            },
                        });

                        const mailOptions = {
                            from: env.GMAIL_USER,
                            to: currentUser.email,
                            subject: "Successful checkout",
                            html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <link href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css" rel="stylesheet">
                    <title>Entrega n° 23</title>
                </head>
                <body >
                    <div id="root">${ReactDOMServer.renderToString(
                        <ReactApp
                            type={"checkout"}
                            products={actualCart.products}
                            orderNumber={orderNumber}
                        />
                    )}
                    </div>
                </body>
                </html>`,
                        };

                        transporter.sendMail(mailOptions, (err, info) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(info);
                            }
                        });
                    } catch (error) {}
                }

                const deletedCart = await this.service.deleteCartService(id);
                const response = apiSuccessResponse(deletedCart, STATUS.OK);
                return res.status(STATUS.OK).json(response);
            }
        } catch (error) {
            next(error);
        }
    }
    async deleteCartController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;
            const deletedCart = await this.service.deleteCartService(id);
            const response = apiSuccessResponse(deletedCart, STATUS.OK);
            return res.status(STATUS.OK).json(response);
        } catch (error) {
            next(error);
        }
    }
}
