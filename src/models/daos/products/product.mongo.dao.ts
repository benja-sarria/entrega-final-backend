import mongodb from "mongodb";
import { MongoClient, ObjectId } from "mongodb";
import {
    DatabaseInstancesInterface,
    ProductInterface,
} from "../../../interfaces/ProductsDaoInterface";
import { CustomError } from "../../../utils/errors/customError";
import { STATUS } from "../../../utils/constants/api.constants";
import { dbConfig } from "../../../DB/config";
import { env } from "../../../config/config";
import { ProductDTO } from "../../dtos/products.dto";

export class ProductMongoDAO {
    _collection?: any;
    static #dbInstances: DatabaseInstancesInterface = {};
    constructor(databaseName: string) {
        if (!ProductMongoDAO.#dbInstances[databaseName]) {
            console.log(
                `[${env.NODE_ENV.trim()}] Connecting to ${databaseName} database ...`
            );
            MongoClient.connect(dbConfig.mongo.uri).then((connection) => {
                ProductMongoDAO.#dbInstances[databaseName] = this;
                const db = connection.db(databaseName);
                this._collection = db.collection("products");
                console.log(
                    `[${env.NODE_ENV.trim()}] Connected to ${databaseName} database ...`
                );
            });
        } else {
            return ProductMongoDAO.#dbInstances[databaseName];
        }
    }

    async getAllProducts() {
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
    async getProductById(id: string) {
        try {
            return await this._collection.findOne({ _id: new ObjectId(id) });
        } catch (error) {
            throw new CustomError(
                STATUS.SERV_ERROR,
                `Error fetching product with id ${id}`,
                `${error}`
            );
        }
    }
    async getProductByCategory(category: string) {
        try {
            return await this._collection.findOne({ category: category });
        } catch (error) {
            throw new CustomError(
                STATUS.SERV_ERROR,
                `Error fetching product within category ${category}`,
                `${error}`
            );
        }
    }
    async saveProduct(product: ProductInterface) {
        try {
            const newProduct = new ProductDTO(product);
            await this._collection.insertOne(newProduct);
            return newProduct;
        } catch (error) {
            throw new CustomError(
                STATUS.SERV_ERROR,
                `Error creating product`,
                `${error}`
            );
        }
    }
    async updateProduct(id: string, updatedProduct: ProductInterface) {
        try {
            await this._collection.updateOne(
                { id: new ObjectId(id) },
                { $set: { ...updatedProduct } }
            );
            return await this._collection.findOne({ _id: new ObjectId(id) });
        } catch (error) {
            throw new CustomError(
                STATUS.SERV_ERROR,
                `Error updating product with id ${id}`,
                `${error}`
            );
        }
    }
    async removeProduct(id: string) {
        try {
            await this._collection.deleteOne({ id: new ObjectId(id) });
            return { message: `Success deleting product with id ${id}` };
        } catch (error) {
            throw new CustomError(
                STATUS.SERV_ERROR,
                `Error deleting product with id ${id}`,
                `${error}`
            );
        }
    }
}
