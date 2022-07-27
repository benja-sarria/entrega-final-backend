import { STATUS } from "../utils/constants/api.constants";
import { apiSuccessResponse, apiFailedResponse } from "../utils/api/api.utils";
import { DAOSFactory } from "../models/daos/daos.factory";
import { env } from "../config/config";
import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";
import { CustomError } from "../utils/errors/customError";

import { MessagesServices } from "../services/messages/messages.services";

export class MessagesControllers {
    service: MessagesServices;
    constructor() {
        this.service = new MessagesServices(
            DAOSFactory.getDAOS(env.DATA_SOURCE).messagesDao
        );

        this.getMessageByIdController =
            this.getMessageByIdController.bind(this);
        this.searchMessageByEmailController =
            this.searchMessageByEmailController.bind(this);
        this.createMessageController = this.createMessageController.bind(this);
        this.deleteMessageController = this.deleteMessageController.bind(this);
    }

    async getMessageByIdController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;
            const cart = await this.service.getMessageByIdService(id);
            const response = apiSuccessResponse(cart, STATUS.OK);
            return res.status(STATUS.OK).json(response);
        } catch (error) {
            next(error);
        }
    }
    async searchMessageByEmailController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const token = req.cookies.user;
            if (token) {
                const decoded = jwt.verify(token, env.JWT_SECRET) as any;

                const existingMessage =
                    await this.service.searchMessageByEmailService(
                        decoded.user.email
                    );

                if (!existingMessage) {
                    return res
                        .status(STATUS.NOT_FOUND)
                        .send(new CustomError(STATUS.NOT_FOUND, "Not found"));
                }
                const response = apiSuccessResponse(
                    existingMessage,
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
    async createMessageController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const token = req.cookies.user;
            if (token) {
                const decoded = jwt.verify(token, env.JWT_SECRET) as any;

                const newMessage = {
                    email: decoded.user.email,
                    message: req.body.message,
                    type: req.body.type,
                };
                const createdMessage = await this.service.createMessageService(
                    newMessage
                );

                const response = apiSuccessResponse(
                    createdMessage,
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
    // async updateCartController(
    //     req: Request,
    //     res: Response,
    //     next: NextFunction
    // ) {
    //     try {
    //         const { params, body } = req;
    //         const { id } = params;
    //         const cartToUpdate = body;

    //         const updatedCart = await this.service.updateCartService(
    //             id,
    //             cartToUpdate
    //         );
    //         const response = apiSuccessResponse(updatedCart, STATUS.CREATED);
    //         return res.status(STATUS.CREATED).json(response);
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    async deleteMessageController(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;
            const deletedMessage = await this.service.deleteMessageService(id);
            const response = apiSuccessResponse(deletedMessage, STATUS.OK);
            return res.status(STATUS.OK).json(response);
        } catch (error) {
            next(error);
        }
    }
}
