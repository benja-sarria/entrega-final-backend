import * as Yup from "yup";

import { UsersInterface } from "../../../interfaces/UsersInterface";

export class UserSchema {
    static #Schema = Yup.object({
        id: Yup.string(),
        name: Yup.string().min(2).required(),
        lastName: Yup.string().required(),
        tel: Yup.string().required(),
        password: Yup.string().required(),
        email: Yup.string().email().required(),
    });
    name: string;
    lastName: string;
    tel: string;
    password: string;
    email: string;

    constructor(
        name: string,
        lastName: string,
        tel: string,
        password: string,
        email: string
    ) {
        this.name = name;
        this.lastName = lastName;
        this.tel = tel;
        this.password = password;
        this.email = email;
    }

    static async validate(userItem: UsersInterface) {
        try {
            return await UserSchema.#Schema.validate(userItem);
        } catch (error) {
            throw error;
        }
    }
}
