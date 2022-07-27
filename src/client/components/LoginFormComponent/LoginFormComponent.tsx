import { FormEvent } from "react";
import axios from "axios";

export const LoginFormComponent = () => {
    return (
        <div className="login-form-container">
            <form
                action="/api/users/login"
                method="post"
                className="login-form"
            >
                <label htmlFor="email" className="login-form-label">
                    E-mail
                    <input
                        type="text"
                        id="email"
                        name="email"
                        className="login-form-input"
                    />
                </label>
                <label htmlFor="password" className="login-form-label">
                    Password
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="login-form-input"
                    />
                </label>

                <input type="submit" />

                {/*    this.name = name;
        this.price = price;
        this.stock = stock;
        this.img = img;
        this.color = color; */}
            </form>
            <a href="/api/users/register"> Registrarme </a>
            <style>
                {`
                    .login-form-container {
                        background-color: grey;
                        min-height: 20em;
                    }
                    .login-form {
                        display: flex;
                        flex-direction: column;
                    }
                    .login-form-label {
                        background-color: white;
                        border: 2px solid grey;
                        border-radius: 1em;
                    }
                    .login-form-input { 
                        padding: 0.5em 1em;
                    }
                `}
            </style>
        </div>
    );
};
