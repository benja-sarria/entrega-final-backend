import { CartInterface } from "../../interfaces/CartInterface";
import { OrderInterface } from "../../interfaces/OrderInterface";

export class OrderDTO {
    createdAt: number;
    updatedAt: number;
    _id?: string;

    constructor(orderItem: OrderInterface, _id?: string) {
        Object.assign(this, orderItem);
        this.createdAt = orderItem.createdAt || Date.now();
        this.updatedAt = Date.now();
        if (_id) this._id = _id;
    }
}
