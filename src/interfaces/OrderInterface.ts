import { ProductInterface } from "./ProductsDaoInterface";

export interface OrderInterface {
    _id?: string;
    id?: number;
    email: string;
    status: string;
    products: ProductInterface[];
    createdAt?: number;
    updatedAt?: number;
}
