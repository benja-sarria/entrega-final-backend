import mongodb from "mongodb";
import { MongoClient, ObjectId } from "mongodb";
import { DatabaseInstancesInterface } from "../../../interfaces/ProductsDaoInterface";
import { CustomError } from "../../../utils/errors/customError";
import { STATUS } from "../../../utils/constants/api.constants";
import { dbConfig } from "../../../DB/config";
import { env } from "../../../config/config";
import { CartInterface } from "../../../interfaces/CartInterface";
import { CartDTO } from "../../dtos/carts.dto";

export class CartMongoDAO {
    _collection?: any;
    static #dbInstances: DatabaseInstancesInterface = {};
    constructor(databaseName: string) {
        if (!CartMongoDAO.#dbInstances[databaseName]) {
            console.log(
                `[${env.NODE_ENV.trim()}] Connecting to ${databaseName} database ...`
            );
            MongoClient.connect(dbConfig.mongo.uri).then((connection) => {
                CartMongoDAO.#dbInstances[databaseName] = this;
                const db = connection.db(databaseName);
                this._collection = db.collection("carts");
                console.log(
                    `[${env.NODE_ENV.trim()}] Connected to ${databaseName} database ...`
                );
            });
        } else {
            return CartMongoDAO.#dbInstances[databaseName];
        }
    }

    async getCartById(id: string) {
        try {
            return await this._collection.findOne({ _id: new ObjectId(id) });
        } catch (error) {
            throw new CustomError(
                STATUS.SERV_ERROR,
                `Error fetching cart with id ${id}`,
                `${error}`
            );
        }
    }
    async searchCartByUserId(id: string) {
        try {
            return await this._collection.findOne({ userId: id });
        } catch (error) {
            throw new CustomError(
                STATUS.SERV_ERROR,
                `Error fetching cart with userId ${id}`,
                `${error}`
            );
        }
    }
    async createCart(cart: CartInterface) {
        try {
            const newCart = new CartDTO(cart);
            await this._collection.insertOne(newCart);
            return newCart;
        } catch (error) {
            throw new CustomError(
                STATUS.SERV_ERROR,
                `Error creating cart`,
                `${error}`
            );
        }
    }
    async updateCart(id: string, updatedCart: CartInterface) {
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
    }
    async deleteCart(id: string) {
        try {
            await this._collection.deleteOne({ _id: new ObjectId(id) });
            return { message: `Success deleting cart with id ${id}` };
        } catch (error) {
            throw new CustomError(
                STATUS.SERV_ERROR,
                `Error deleting product with id ${id}`,
                `${error}`
            );
        }
    }
}
