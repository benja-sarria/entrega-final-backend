import { response, Router } from "express";
import passport from "../../utils/auth/auth";
import { ProductControllers } from "../../controllers/products.controllers";
import { UserControllers } from "../../controllers/users.controllers";

const router = Router();

class UserRoutes {
    controller: UserControllers;
    constructor() {
        this.controller = new UserControllers();
    }

    initialize(prefix: string = "") {
        router.get(
            `${prefix}/register`,
            this.controller.userCreationPageController
        );

        router.get(`${prefix}/allUsers`, this.controller.getUsersController);

        router.get(`${prefix}/search`, this.controller.getUserByIdController);

        router.post(
            `${prefix}/register`,
            passport.authenticate("register"),
            this.controller.createUserController
        );

        router.put(
            `${prefix}/update/:id`,
            this.controller.updateUserController
        );

        router.delete(
            `${prefix}/delete/:id`,
            this.controller.deleteUserController
        );

        router.post(
            `${prefix}/login`,
            passport.authenticate("login"),
            this.controller.loginUserController
        );

        router.get(`${prefix}/login`, this.controller.loginScreenController);

        router.get(`${prefix}/logout`, this.controller.logoutUserController);

        return router;
    }
}

export default new UserRoutes();
