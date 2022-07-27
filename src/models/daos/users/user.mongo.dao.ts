import mongodb from "mongodb";
import { MongoClient, ObjectId } from "mongodb";
import { DatabaseInstancesInterface } from "../../../interfaces/ProductsDaoInterface";
import { CustomError } from "../../../utils/errors/customError";
import { STATUS } from "../../../utils/constants/api.constants";
import { dbConfig } from "../../../DB/config";
import { env } from "../../../config/config";

import { UsersInterface } from "../../../interfaces/UsersInterface";
import { UserDTO } from "../../dtos/users.dto";

export class UserMongoDAO {
    _collection?: any;
    static #dbInstances: DatabaseInstancesInterface = {};
    constructor(databaseName: string) {
        if (!UserMongoDAO.#dbInstances[databaseName]) {
            console.log(
                `[${env.NODE_ENV.trim()}] Connecting to ${databaseName} database ...`
            );
            MongoClient.connect(dbConfig.mongo.uri).then((connection) => {
                UserMongoDAO.#dbInstances[databaseName] = this;
                const db = connection.db(databaseName);
                this._collection = db.collection("users");
                console.log(
                    `[${env.NODE_ENV.trim()}] Connected to ${databaseName} database ...`
                );
            });
        } else {
            return UserMongoDAO.#dbInstances[databaseName];
        }
    }

    async getAllUsers() {
        try {
            return await this._collection.find().toArray();
        } catch (error) {
            throw new CustomError(
                STATUS.SERV_ERROR,
                "Error fetching users",
                `${error}`
            );
        }
    }
    async getUserById(id: string) {
        try {
            return await this._collection.findOne({ _id: new ObjectId(id) });
        } catch (error) {
            throw new CustomError(
                STATUS.SERV_ERROR,
                `Error fetching user with id ${id}`,
                `${error}`
            );
        }
    }
    async getUserByEmail(email: string) {
        try {
            return await this._collection.findOne({ email: email });
        } catch (error) {
            throw new CustomError(
                STATUS.SERV_ERROR,
                `Error fetching user with email ${email}`,
                `${error}`
            );
        }
    }
    async saveUser(user: UsersInterface) {
        try {
            const newUser = new UserDTO(user);
            await this._collection.insertOne(newUser);
            return newUser;
        } catch (error) {
            throw new CustomError(
                STATUS.SERV_ERROR,
                `Error creating user`,
                `${error}`
            );
        }
    }
    async updateUser(id: string, updatedUser: UsersInterface) {
        try {
            await this._collection.updateOne(
                { id: new ObjectId(id) },
                { $set: { ...updatedUser } }
            );
            return await this._collection.findOne({ _id: new ObjectId(id) });
        } catch (error) {
            throw new CustomError(
                STATUS.SERV_ERROR,
                `Error updating user with id ${id}`,
                `${error}`
            );
        }
    }
    async removeUser(id: string) {
        try {
            await this._collection.deleteOne({ id: new ObjectId(id) });
            return { message: `Success deleting user with id ${id}` };
        } catch (error) {
            throw new CustomError(
                STATUS.SERV_ERROR,
                `Error deleting user with id ${id}`,
                `${error}`
            );
        }
    }
}
