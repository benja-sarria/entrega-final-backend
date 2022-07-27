import { UsersInterface } from "../../interfaces/UsersInterface";

export class UserDTO {
    createdAt: number;
    updatedAt: number;
    _id?: string;

    constructor(userItem: UsersInterface, _id?: string) {
        Object.assign(this, userItem);
        this.createdAt = userItem.createdAt || Date.now();
        this.updatedAt = Date.now();
        if (_id) this._id = _id;
    }
}
