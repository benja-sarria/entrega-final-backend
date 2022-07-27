import { FormEvent } from "react";
import axios from "axios";

export const UserRegistrationFormComponent = () => {
    return (
        <div className="user-form-container">
            <form
                action="/api/users/register"
                method="post"
                className="user-form"
            >
                <label htmlFor="name" className="user-form-label">
                    Nombre
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="user-form-input"
                    />
                </label>
                <label htmlFor="lastName" className="user-form-label">
                    Apellido
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="user-form-input"
                    />
                </label>
                <label htmlFor="tel" className="user-form-label">
                    Teléfono
                    <input
                        type="string"
                        id="tel"
                        name="tel"
                        className="user-form-input"
                    />
                </label>
                <label htmlFor="email" className="user-form-label">
                    E-mail
                    <input
                        type="string"
                        id="email"
                        name="email"
                        className="user-form-input"
                    />
                </label>
                <label htmlFor="password" className="user-form-label">
                    Password
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="user-form-input"
                    />
                </label>
                <label htmlFor="verification" className="user-form-label">
                    Verify password
                    <input
                        type="password"
                        id="verification"
                        name="verification"
                        className="user-form-input"
                    />
                </label>
                <input type="submit" />

                {/*    this.name = name;
        this.price = price;
        this.stock = stock;
        this.img = img;
        this.color = color; */}
            </form>
            <a href="/api/users/login"> Iniciar Sesión </a>
            <style>
                {`
                    .user-form-container {
                        background-color: grey;
                        min-height: 20em;
                    }
                    .user-form {
                        display: flex;
                        flex-direction: column;
                    }
                    .user-form-label {
                        background-color: white;
                        border: 2px solid grey;
                        border-radius: 1em;
                    }
                    .user-form-input { 
                        padding: 0.5em 1em;
                    }
                `}
            </style>
        </div>
    );
};
