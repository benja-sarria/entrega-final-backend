import { response, Router } from "express";
import { CartControllers } from "../../controllers/cart.controllers";
import { ProductControllers } from "../../controllers/products.controllers";

const router = Router();

class CartRoutes {
    controller: CartControllers;
    constructor() {
        this.controller = new CartControllers();
    }

    initialize(prefix: string = "") {
        router.get(
            `${prefix}/getCart/:id`,
            this.controller.getCartByIdController
        );

        router.get(`${prefix}/search`, this.controller.searchCartController);

        router.get(`${prefix}/create`, this.controller.createCartController);

        router.post(
            `${prefix}/update/:id`,
            this.controller.updateCartController
        );

        router.delete(
            `${prefix}/delete/:id`,
            this.controller.deleteCartController
        );

        router.get(
            `${prefix}/checkout/:id`,
            this.controller.checkoutCartController
        );

        return router;
    }
}

export default new CartRoutes();
