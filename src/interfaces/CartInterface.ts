import { ProductInterface } from "./ProductsDaoInterface";

export interface CartInterface {
    _id?: string;
    userId: string;
    products: ProductInterface[];
    createdAt?: number;
    updatedAt?: number;
}
