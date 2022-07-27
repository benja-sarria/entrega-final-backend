import { env } from "../../config/config";
import { CartInterface } from "../../interfaces/CartInterface";
import { MessageInterface } from "../../interfaces/MessageInterface";
import { ProductInterface } from "../../interfaces/ProductsDaoInterface";
import { CartMongoDAO } from "../../models/daos/carts/cart.mongo.dao";
import { DAOSFactory } from "../../models/daos/daos.factory";
import { MessageMongoDAO } from "../../models/daos/messages/message.mongo.dao";
import { ProductMongoDAO } from "../../models/daos/products/product.mongo.dao";
import { CartSchema } from "../../models/schemas/carts/carts.schema";
import { MessageSchema } from "../../models/schemas/messages/messages.schema";
import { ProductSchema } from "../../models/schemas/products/products.schema";
import { STATUS } from "../../utils/constants/api.constants";
import { CustomError } from "../../utils/errors/customError";

export class MessagesServices {
    messagesDAO: any;
    static async #validateMessages(message: MessageInterface) {
        try {
            return await MessageSchema.validate(message);
        } catch (error) {
            throw new CustomError(
                STATUS.BAD_REQUEST,
                `Validation error`,
                `${error}`
            );
        }
    }
    // productDao tiene que ser DAOSFactory.getDAOS(env.DATA_SOURCE).productDAO
    constructor(messagesDAO: MessageMongoDAO) {
        this.messagesDAO = messagesDAO;
    }

    async getMessagesService() {
        return await this.messagesDAO.getAllMessages();
    }
    async getMessageByIdService(id: string) {
        if (!id) {
            throw new CustomError(STATUS.BAD_REQUEST, `Invalid id`);
        }
        return await this.messagesDAO.getMessageById(id);
    }
    async searchMessageByEmailService(email: string) {
        if (!email) {
            throw new CustomError(STATUS.BAD_REQUEST, `Invalid email`);
        }
        return await this.messagesDAO.searchMessagesByUserEmail(email);
    }
    async createMessageService(message: MessageInterface) {
        console.log(message);
        message.type = message.type || "user";
        const validatedMessage = await MessagesServices.#validateMessages(
            message
        );
        console.log("[VALIDATED-MESSAGE] => ", validatedMessage);

        return await this.messagesDAO.createMessage(validatedMessage);
    }
    /*  async updateCartService(id: string, cart: CartInterface) {
        if (!id) {
            throw new CustomError(STATUS.BAD_REQUEST, `Invalid id`);
        }
        return await this.cartsDAO.updateCart(id, cart);
    } */
    async deleteMessageService(id: string) {
        if (!id) {
            throw new CustomError(STATUS.BAD_REQUEST, `Invalid id`);
        }
        return await this.messagesDAO.deleteMessage(id);
    }
}
