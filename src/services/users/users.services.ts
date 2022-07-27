import { env } from "../../config/config";
import { UsersInterface } from "../../interfaces/UsersInterface";
import { DAOSFactory } from "../../models/daos/daos.factory";
import { UserMongoDAO } from "../../models/daos/users/user.mongo.dao";
import { UserSchema } from "../../models/schemas/users/users.schema";
import { STATUS } from "../../utils/constants/api.constants";
import { CustomError } from "../../utils/errors/customError";

export class UserServices {
    usersDAO: any;
    static async #validateUser(user: UsersInterface) {
        try {
            return await UserSchema.validate(user);
        } catch (error) {
            throw new CustomError(
                STATUS.BAD_REQUEST,
                `Validation error`,
                `${error}`
            );
        }
    }
    // productDao tiene que ser DAOSFactory.getDAOS(env.DATA_SOURCE).productDAO
    constructor(usersDao: UserMongoDAO) {
        this.usersDAO = usersDao;
    }

    async getUsersService() {
        return await this.usersDAO.getAllUsers();
    }
    async getUserByIdService(id: string) {
        if (!id) {
            throw new CustomError(STATUS.BAD_REQUEST, `Invalid id`);
        }
        return await this.usersDAO.getUserById(id);
    }
    async getUserByEmailService(email: string) {
        if (!email) {
            throw new CustomError(STATUS.BAD_REQUEST, `Invalid email`);
        }
        return await this.usersDAO.getUserByEmail(email);
    }
    async createUserService(user: UsersInterface) {
        console.log(user);

        const validatedUser = await UserServices.#validateUser(user);
        console.log("[VALIDATED-USER] => ", validatedUser);

        return await this.usersDAO.saveUser(validatedUser);
    }
    async updateUserService(id: string, user: UsersInterface) {
        if (!id) {
            throw new CustomError(STATUS.BAD_REQUEST, `Invalid id`);
        }
        return await this.usersDAO.updateProduct(id, user);
    }
    async deleteUserService(id: string) {
        if (!id) {
            throw new CustomError(STATUS.BAD_REQUEST, `Invalid id`);
        }
        return await this.usersDAO.removeProduct(id);
    }
}
