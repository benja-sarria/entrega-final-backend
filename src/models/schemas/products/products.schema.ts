import * as Yup from "yup";
import { ProductInterface } from "../../../interfaces/ProductsDaoInterface";

export class ProductSchema {
    static #Schema = Yup.object({
        id: Yup.string(),
        name: Yup.string().min(4).required(),
        description: Yup.string().required(),
        category: Yup.string().required(),
        price: Yup.number().required(),
        stock: Yup.number().required(),
        img: Yup.string().required(),
        color: Yup.string().required(),
    });
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    img: string;
    color: string;

    constructor(
        name: string,
        description: string,
        category: string,
        price: number,
        stock: number,
        img: string,
        color: string
    ) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.price = price;
        this.stock = stock;
        this.img = img;
        this.color = color;
    }

    static async validate(productItem: ProductInterface) {
        try {
            return await ProductSchema.#Schema.validate(productItem);
        } catch (error) {
            throw error;
        }
    }
}
