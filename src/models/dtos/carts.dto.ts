import { CartInterface } from "../../interfaces/CartInterface";

export class CartDTO {
    createdAt: number;
    updatedAt: number;
    _id?: string;

    constructor(cartItem: CartInterface, _id?: string) {
        Object.assign(this, cartItem);
        this.createdAt = cartItem.createdAt || Date.now();
        this.updatedAt = Date.now();
        if (_id) this._id = _id;
    }
}
