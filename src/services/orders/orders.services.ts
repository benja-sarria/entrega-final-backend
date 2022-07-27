import { env } from "../../config/config";
import { CartInterface } from "../../interfaces/CartInterface";
import { OrderInterface } from "../../interfaces/OrderInterface";
import { ProductInterface } from "../../interfaces/ProductsDaoInterface";
import { CartMongoDAO } from "../../models/daos/carts/cart.mongo.dao";
import { DAOSFactory } from "../../models/daos/daos.factory";
import { OrdersMongoDAO } from "../../models/daos/orders/orders.mongo.dao";
import { ProductMongoDAO } from "../../models/daos/products/product.mongo.dao";
import { CartSchema } from "../../models/schemas/carts/carts.schema";
import { OrderSchema } from "../../models/schemas/order/order.schema";
import { ProductSchema } from "../../models/schemas/products/products.schema";
import { STATUS } from "../../utils/constants/api.constants";
import { CustomError } from "../../utils/errors/customError";

export class OrderServices {
    ordersDAO: any;
    static async #validateOrder(order: OrderInterface) {
        try {
            return await OrderSchema.validate(order);
        } catch (error) {
            throw new CustomError(
                STATUS.BAD_REQUEST,
                `Validation error`,
                `${error}`
            );
        }
    }
    // productDao tiene que ser DAOSFactory.getDAOS(env.DATA_SOURCE).productDAO
    constructor(ordersDAO: OrdersMongoDAO) {
        this.ordersDAO = ordersDAO;
    }

    async getOrdersAmountService() {
        return await this.ordersDAO.getAllOrdersAmount();
    }

    async createOrderService(order: OrderInterface) {
        console.log(order);
        order.status = "generated";
        const validatedOrder = await OrderServices.#validateOrder(order);
        console.log("[VALIDATED-ORDER] => ", validatedOrder);

        return await this.ordersDAO.createOrder(validatedOrder);
    }
}
