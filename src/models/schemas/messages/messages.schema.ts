import * as Yup from "yup";

import { MessageInterface } from "../../../interfaces/MessageInterface";

export class MessageSchema {
    static #Schema = Yup.object({
        id: Yup.string(),
        email: Yup.string().email().required(),
        message: Yup.string().required(),
        type: Yup.string().required(),
        createdAt: Yup.number(),
        updatedAt: Yup.number(),
    });
    email: string;
    message: string;
    createdAt: number;
    updatedAt: number;

    constructor(
        email: string,
        message: string,

        createdAt: number,
        updatedAt: number
    ) {
        this.email = email;
        this.message = message;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static async validate(messageItem: MessageInterface) {
        try {
            return await MessageSchema.#Schema.validate(messageItem);
        } catch (error) {
            throw error;
        }
    }
}
