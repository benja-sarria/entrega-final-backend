import mongodb from "mongodb";
import { MongoClient, ObjectId } from "mongodb";
import { DatabaseInstancesInterface } from "../../../interfaces/ProductsDaoInterface";
import { CustomError } from "../../../utils/errors/customError";
import { STATUS } from "../../../utils/constants/api.constants";
import { dbConfig } from "../../../DB/config";
import { env } from "../../../config/config";
import { CartInterface } from "../../../interfaces/CartInterface";
import { CartDTO } from "../../dtos/carts.dto";
import { OrderInterface } from "../../../interfaces/OrderInterface";
import { OrderDTO } from "../../dtos/orders.dto";

export class OrdersMongoDAO {
    _collection?: any;
    static #dbInstances: DatabaseInstancesInterface = {};
    constructor(databaseName: string) {
        if (!OrdersMongoDAO.#dbInstances[databaseName]) {
            console.log(
                `[${env.NODE_ENV.trim()}] Connecting to ${databaseName} database ...`
            );
            MongoClient.connect(dbConfig.mongo.uri).then((connection) => {
                OrdersMongoDAO.#dbInstances[databaseName] = this;
                const db = connection.db(databaseName);
                this._collection = db.collection("orders");
                console.log(
                    `[${env.NODE_ENV.trim()}] Connected to ${databaseName} database ...`
                );
            });
        } else {
            return OrdersMongoDAO.#dbInstances[databaseName];
        }
    }
    async getAllOrdersAmount() {
        try {
            return await this._collection.find().toArray();
        } catch (error) {
            throw new CustomError(
                STATUS.SERV_ERROR,
                "Error fetching products",
                `${error}`
            );
        }
    }

    async createOrder(order: OrderInterface) {
        try {
            console.log("[ARRIVING-ORDER] => ", order);

            const newOrder = new OrderDTO(order);
            await this._collection.insertOne(order);
            return newOrder;
        } catch (error) {
            throw new CustomError(
                STATUS.SERV_ERROR,
                `Error creating order`,
                `${error}`
            );
        }
    }
}
