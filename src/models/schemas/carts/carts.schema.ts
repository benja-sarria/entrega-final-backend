import * as Yup from "yup";
import { CartInterface } from "../../../interfaces/CartInterface";
import { ProductInterface } from "../../../interfaces/ProductsDaoInterface";

export class CartSchema {
    static #Schema = Yup.object({
        id: Yup.string(),
        userId: Yup.string(),

        createdAt: Yup.number(),
        updatedAt: Yup.number(),
    });
    userId: string;

    createdAt: number;
    updatedAt: number;

    constructor(
        userId: string,

        createdAt: number,
        updatedAt: number
    ) {
        this.userId = userId;

        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static async validate(cartItem: CartInterface) {
        try {
            return await CartSchema.#Schema.validate(cartItem);
        } catch (error) {
            throw error;
        }
    }
}
