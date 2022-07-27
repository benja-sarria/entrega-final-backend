import { Router } from "express";
import productsRoutes from "./products/products.routes";
import { errorMiddleware } from "../middlewares/error.middleware";
import usersRoutes from "./users/users.routes";
import clientRoutes from "./client/client.routes";
import cartRoutes from "./cart/cart.routes";
import messagesRoutes from "./messages/messages.routes";

export const router = Router();

// Routes
router.use("/products", productsRoutes.initialize());
router.use("/users", usersRoutes.initialize());
router.use("/cart", cartRoutes.initialize());
router.use("/messages", messagesRoutes.initialize());
router.use("/client", clientRoutes.initialize());

// Error Middleware al final de las rutas
router.use(errorMiddleware);
