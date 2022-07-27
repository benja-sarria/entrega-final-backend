import { CartMongoDAO } from "./carts/cart.mongo.dao";
import { MessageMongoDAO } from "./messages/message.mongo.dao";
import { OrdersMongoDAO } from "./orders/orders.mongo.dao";
import { ProductMongoDAO } from "./products/product.mongo.dao";
import { UserMongoDAO } from "./users/user.mongo.dao";

export class DAOSFactory {
    static getDAOS(type: string) {
        let productDao;
        let messagesDao;
        let userDao;
        let cartDao;
        let ordersDao;
        switch (type.toLowerCase()) {
            case "mongo":
                productDao = new ProductMongoDAO("coderhouse-ecommerce");
                userDao = new UserMongoDAO("coderhouse-ecommerce");
                cartDao = new CartMongoDAO("coderhouse-ecommerce");
                messagesDao = new MessageMongoDAO("coderhouse-ecommerce");
                ordersDao = new OrdersMongoDAO("coderhouse-ecommerce");
                break;
            default:
                throw new Error(
                    "Invalid data source, please provide one of the following: mongo"
                );
        }
        return {
            productDao,
            userDao,
            messagesDao,
            cartDao,
            ordersDao,
        };
    }
}
