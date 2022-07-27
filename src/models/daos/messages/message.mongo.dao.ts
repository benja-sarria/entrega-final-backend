import mongodb from "mongodb";
import { MongoClient, ObjectId } from "mongodb";
import { DatabaseInstancesInterface } from "../../../interfaces/ProductsDaoInterface";
import { CustomError } from "../../../utils/errors/customError";
import { STATUS } from "../../../utils/constants/api.constants";
import { dbConfig } from "../../../DB/config";
import { env } from "../../../config/config";
import { CartInterface } from "../../../interfaces/CartInterface";
import { CartDTO } from "../../dtos/carts.dto";
import { MessageInterface } from "../../../interfaces/MessageInterface";
import { MessageDTO } from "../../dtos/messages.dto";

export class MessageMongoDAO {
    _collection?: any;
    static #dbInstances: DatabaseInstancesInterface = {};
    constructor(databaseName: string) {
        if (!MessageMongoDAO.#dbInstances[databaseName]) {
            console.log(
                `[${env.NODE_ENV.trim()}] Connecting to ${databaseName} database ...`
            );
            MongoClient.connect(dbConfig.mongo.uri).then((connection) => {
                MessageMongoDAO.#dbInstances[databaseName] = this;
                const db = connection.db(databaseName);
                this._collection = db.collection("messages");
                console.log(
                    `[${env.NODE_ENV.trim()}] Connected to ${databaseName} database ...`
                );
            });
        } else {
            return MessageMongoDAO.#dbInstances[databaseName];
        }
    }
    async getAllMessages() {
        try {
            return await this._collection.find().toArray();
        } catch (error) {
            throw new CustomError(
                STATUS.SERV_ERROR,
                "Error fetching messages",
                `${error}`
            );
        }
    }
    async getMessageById(id: string) {
        try {
            return await this._collection.findOne({ _id: new ObjectId(id) });
        } catch (error) {
            throw new CustomError(
                STATUS.SERV_ERROR,
                `Error fetching message with id ${id}`,
                `${error}`
            );
        }
    }
    async searchMessagesByUserEmail(email: string) {
        try {
            return await this._collection.findOne({ email: email });
        } catch (error) {
            throw new CustomError(
                STATUS.SERV_ERROR,
                `Error fetching cart with email ${email}`,
                `${error}`
            );
        }
    }
    async createMessage(message: MessageInterface) {
        try {
            const newMessage = new MessageDTO(message);
            await this._collection.insertOne(newMessage);
            return newMessage;
        } catch (error) {
            throw new CustomError(
                STATUS.SERV_ERROR,
                `Error creating message`,
                `${error}`
            );
        }
    }
    /*  async updateCart(id: string, updatedCart: CartInterface) {
        try {
            console.log(updatedCart);

            const updated = await this._collection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        products: updatedCart.products,
                        updatedAt: Date.now(),
                    },
                }
            );
            return updatedCart;
        } catch (error) {
            throw new CustomError(
                STATUS.SERV_ERROR,
                `Error updating cart with id ${id}`,
                `${error}`
            );
        }
    } */

    async deleteMessage(id: string) {
        try {
            await this._collection.deleteOne({ _id: new ObjectId(id) });
            return { message: `Success deleting message with id ${id}` };
        } catch (error) {
            throw new CustomError(
                STATUS.SERV_ERROR,
                `Error deleting product with id ${id}`,
                `${error}`
            );
        }
    }
}
