import { CartInterface } from "../../interfaces/CartInterface";
import { MessageInterface } from "../../interfaces/MessageInterface";

export class MessageDTO {
    createdAt: number;
    updatedAt: number;
    _id?: string;

    constructor(messageItem: MessageInterface, _id?: string) {
        Object.assign(this, messageItem);
        this.createdAt = messageItem.createdAt || Date.now();
        this.updatedAt = Date.now();
        if (_id) this._id = _id;
    }
}
