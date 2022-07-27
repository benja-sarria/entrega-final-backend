import { env } from "../../config/config";
import { CartInterface } from "../../interfaces/CartInterface";
import { ProductInterface } from "../../interfaces/ProductsDaoInterface";
import { CartMongoDAO } from "../../models/daos/carts/cart.mongo.dao";
import { DAOSFactory } from "../../models/daos/daos.factory";
import { ProductMongoDAO } from "../../models/daos/products/product.mongo.dao";
import { CartSchema } from "../../models/schemas/carts/carts.schema";
import { ProductSchema } from "../../models/schemas/products/products.schema";
import { STATUS } from "../../utils/constants/api.constants";
import { CustomError } from "../../utils/errors/customError";

export class CartServices {
    cartsDAO: any;
    static async #validateCart(cart: CartInterface) {
        try {
            return await CartSchema.validate(cart);
        } catch (error) {
            throw new CustomError(
                STATUS.BAD_REQUEST,
                `Validation error`,
                `${error}`
            );
        }
    }
    // productDao tiene que ser DAOSFactory.getDAOS(env.DATA_SOURCE).productDAO
    constructor(cartsDao: CartMongoDAO) {
        this.cartsDAO = cartsDao;
    }

    // async getProductsService() {
    //     return await this.productsDAO.getAllProducts();
    // }
    async getCartByIdService(id: string) {
        if (!id) {
            throw new CustomError(STATUS.BAD_REQUEST, `Invalid id`);
        }
        return await this.cartsDAO.getCartById(id);
    }
    async searchCartByUserIdService(id: string) {
        if (!id) {
            throw new CustomError(STATUS.BAD_REQUEST, `Invalid id`);
        }
        return await this.cartsDAO.searchCartByUserId(id);
    }
    async createCartService(cart: CartInterface) {
        console.log(cart);

        const validatedCart = await CartServices.#validateCart(cart);
        console.log("[VALIDATED-CART] => ", validatedCart);

        return await this.cartsDAO.createCart(validatedCart);
    }
    async updateCartService(id: string, cart: CartInterface) {
        if (!id) {
            throw new CustomError(STATUS.BAD_REQUEST, `Invalid id`);
        }
        return await this.cartsDAO.updateCart(id, cart);
    }
    async deleteCartService(id: string) {
        if (!id) {
            throw new CustomError(STATUS.BAD_REQUEST, `Invalid id`);
        }
        return await this.cartsDAO.deleteCart(id);
    }
}
