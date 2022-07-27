import * as Yup from "yup";
import { CartInterface } from "../../../interfaces/CartInterface";
import { OrderInterface } from "../../../interfaces/OrderInterface";
import { ProductInterface } from "../../../interfaces/ProductsDaoInterface";

export class OrderSchema {
    static #Schema = Yup.object({
        id: Yup.number(),
        email: Yup.string(),

        createdAt: Yup.number(),
        updatedAt: Yup.number(),
    });
    id: number;
    email: string;
    createdAt: number;
    updatedAt: number;

    constructor(
        id: number,
        email: string,
        createdAt: number,
        updatedAt: number
    ) {
        this.id = id;
        this.email = email;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static async validate(orderItem: OrderInterface) {
        try {
            return await OrderSchema.#Schema.validate(orderItem);
        } catch (error) {
            throw error;
        }
    }
}
