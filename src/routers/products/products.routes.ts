import { response, Router } from "express";
import { ProductControllers } from "../../controllers/products.controllers";

const router = Router();

class ProductRoutes {
    controller: ProductControllers;
    constructor() {
        this.controller = new ProductControllers();
    }

    initialize(prefix: string = "") {
        router.get(
            `${prefix}/create`,
            this.controller.productCreationPageController
        );

        router.get(
            `${prefix}/allProducts`,
            this.controller.getProductsController
        );

        router.get(
            `${prefix}/search/:id`,
            this.controller.getProductsByIdController
        );
        router.get(
            `${prefix}/search/:category`,
            this.controller.getProductsByCategoryController
        );

        router.post(
            `${prefix}/create`,
            this.controller.createProductController
        );

        router.put(
            `${prefix}/update/:id`,
            this.controller.updateProductController
        );

        router.delete(
            `${prefix}/delete/:id`,
            this.controller.deleteProductController
        );

        return router;
    }
}

export default new ProductRoutes();
