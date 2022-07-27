import { response, Router } from "express";
import { ClientControllers } from "../../controllers/client.controllers";
import { ProductControllers } from "../../controllers/products.controllers";

const router = Router();

class ClientRoutes {
    controller: ClientControllers;
    constructor() {
        this.controller = new ClientControllers();
    }

    initialize(prefix: string = "") {
        router.get(`${prefix}/`, this.controller.homeScreenController);

        return router;
    }
}

export default new ClientRoutes();
