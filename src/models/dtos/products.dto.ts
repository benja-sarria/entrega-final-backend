import { ProductInterface } from "../../interfaces/ProductsDaoInterface";

export class ProductDTO {
    createdAt: number;
    updatedAt: number;
    _id?: string;

    constructor(productItem: ProductInterface, _id?: string) {
        Object.assign(this, productItem);
        this.createdAt = productItem.createdAt || Date.now();
        this.updatedAt = Date.now();
        if (_id) this._id = _id;
    }
}
