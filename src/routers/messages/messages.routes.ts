import { response, Router } from "express";
import { CartControllers } from "../../controllers/cart.controllers";
import { MessagesControllers } from "../../controllers/messages.controllers";
import { ProductControllers } from "../../controllers/products.controllers";

const router = Router();

class MessagesRoutes {
    controller: MessagesControllers;
    constructor() {
        this.controller = new MessagesControllers();
    }

    initialize(prefix: string = "") {
        router.get(
            `${prefix}/chat/:id`,
            this.controller.getMessageByIdController
        );

        router.get(
            `${prefix}/search/:id`,
            this.controller.searchMessageByEmailController
        );

        router.post(`${prefix}/save`, this.controller.createMessageController);

        /*  router.post(
            `${prefix}/update/:id`,
            this.controller.updateCartController
        ); */

        router.delete(
            `${prefix}/delete/:id`,
            this.controller.deleteMessageController
        );

        return router;
    }
}

export default new MessagesRoutes();
