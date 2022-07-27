import { STATUS } from "../utils/constants/api.constants";
import { apiSuccessResponse, apiFailedResponse } from "../utils/api/api.utils";
import { DAOSFactory } from "../models/daos/daos.factory";
import { env } from "../config/config";
import bcrypt from "bcrypt";
import ReactApp from "../client/App";
import ReactDOMServer from "react-dom/server";
import { NextFunction, Request, Response } from "express";
import { UserServices } from "../services/users/users.services";
import { UsersInterface } from "../interfaces/UsersInterface";
import jwt from "jsonwebtoken";
import { CustomError } from "../utils/errors/customError";
import nodemailer from "nodemailer";

export class UserControllers {
    service: UserServices;
    constructor() {
        this.service = new UserServices(
            DAOSFactory.getDAOS(env.DATA_SOURCE).userDao
        );
        this.getUsersController = this.getUsersController.bind(this);
        this.getUserByIdController = this.getUserByIdController.bind(this);
        this.createUserController = this.createUserController.bind(this);
        this.updateUserController = this.updateUserController.bind(this);
        this.deleteUserController = this.deleteUserController.bind(this);
        this.userCreationPageController =
            this.userCreationPageController.bind(this);
        this.loginUserController = this.loginUserController.bind(this);
        this.loginScreenController = this.loginScreenController.bind(this);
    }
    async getUsersController(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.service.getUsersService();
            const response = apiSuccessResponse(users, STATUS.OK);
            return res.status(STATUS.OK).json(response);
        } catch (error) {
            next(error);
        }
    }
    async getUserByIdController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            // verify a token symmetric
            console.log(req.cookies);
            if (req.cookies.user) {
                const token = req.cookies.user;
                if (token) {
                    const decoded = jwt.verify(token, env.JWT_SECRET) as any;

                    console.log(decoded); // bar

                    const user = await this.service.getUserByIdService(
                        decoded.user._id
                    );
                    const response = apiSuccessResponse(user, STATUS.OK);
                    return res.status(STATUS.OK).json(response);
                }
            } else {
                return res
                    .status(STATUS.NOT_FOUND)
                    .json(new CustomError(STATUS.NOT_FOUND, "Not logged in"));
            }
        } catch (error) {
            next(error);
        }
    }
    async createUserController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            if (req.user) {
                const currentUser = req.user as UsersInterface;
                const body = { _id: currentUser._id, email: currentUser.email };
                const token = jwt.sign({ user: body }, env.JWT_SECRET);
                const response = apiSuccessResponse(token, STATUS.CREATED);

                res.cookie("user", token, {
                    maxAge: 900000,
                    httpOnly: true,
                });
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
                    subject: "Successful registration",
                    html: "<div>The registration was made successfully</div>",
                };

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(info);
                    }
                });

                return res.status(STATUS.OK).redirect("http://localhost:3000");
            } else {
                const response = apiSuccessResponse(
                    "Undefined",
                    STATUS.SERV_ERROR
                );

                return res.status(STATUS.SERV_ERROR).json(response);
            }
        } catch (error) {
            next(error);
        }
    }
    async updateUserController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { params, body } = req;
            const { id } = params;
            const userToUpdate = body;
            const updatedUser = await this.service.updateUserService(
                id,
                userToUpdate
            );
            const response = apiSuccessResponse(updatedUser, STATUS.CREATED);
            return res.status(STATUS.CREATED).json(response);
        } catch (error) {
            next(error);
        }
    }
    async deleteUserController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;
            const deletedUser = await this.service.deleteUserService(id);
            const response = apiSuccessResponse(deletedUser, STATUS.OK);
            return res.status(STATUS.OK).json(response);
        } catch (error) {
            next(error);
        }
    }

    async userCreationPageController(
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
                        <ReactApp type={"user"} />
                    )}
                    </div>
                </body>
                </html>`);
        } catch (error) {
            next(error);
        }
    }

    async loginUserController(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.user) {
                const currentUser = req.user as UsersInterface;
                const body = { _id: currentUser._id, email: currentUser.email };
                const token = jwt.sign({ user: body }, env.JWT_SECRET);
                const response = apiSuccessResponse(token, STATUS.OK);
                res.cookie("user", token, {
                    maxAge: 900000,
                    httpOnly: true,
                });
                return res.status(STATUS.OK).redirect("http://localhost:3000");
            } else {
                const response = apiSuccessResponse(
                    "Undefined",
                    STATUS.NOT_FOUND
                );
                return res.status(STATUS.NOT_FOUND).json(response);
            }
        } catch (error) {
            next(error);
        }
    }

    async logoutUserController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            res.cookie("user", "", {
                maxAge: -9000000000,
                httpOnly: true,
            });
            res.cookie("coder-session", "", {
                maxAge: -9000000000,
                httpOnly: true,
            });
            return res.status(STATUS.OK).json({ message: "Logged out" });
        } catch (error) {
            next(error);
        }
    }

    async loginScreenController(
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
                            <ReactApp type={"login"} />
                        )}
                        </div>
                    </body>
                    </html>`);
        } catch (error) {
            next(error);
        }
    }
}
