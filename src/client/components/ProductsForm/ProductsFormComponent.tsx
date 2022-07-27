import { FormEvent } from "react";
import axios from "axios";

export const ProductsFormComponent = () => {
    return (
        <div className="product-form-container">
            <form
                action="/api/products/create"
                method="post"
                className="product-form"
            >
                <label htmlFor="name" className="product-form-label">
                    Nombre del producto
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="product-form-input"
                    />
                </label>
                <label htmlFor="description" className="product-form-label">
                    Descripción
                    <textarea
                        id="description"
                        name="description"
                        className="product-form-input"
                    />
                </label>
                <label htmlFor="category" className="product-form-label">
                    Categoría
                    <textarea
                        id="category"
                        name="category"
                        className="product-form-input"
                    />
                </label>
                <label htmlFor="price" className="product-form-label">
                    Precio
                    <input
                        type="number"
                        id="price"
                        name="price"
                        className="product-form-input"
                    />
                </label>
                <label htmlFor="img" className="product-form-label">
                    Imagen
                    <input
                        type="text"
                        id="img"
                        name="img"
                        className="product-form-input"
                    />
                </label>
                <label htmlFor="color" className="product-form-label">
                    Color
                    <input
                        type="text"
                        id="color"
                        name="color"
                        className="product-form-input"
                    />
                </label>
                <label htmlFor="stock" className="product-form-label">
                    Stock
                    <input
                        type="number"
                        id="stock"
                        name="stock"
                        className="product-form-input"
                    />
                </label>
                <input type="submit" />

                {/*    this.name = name;
        this.price = price;
        this.stock = stock;
        this.img = img;
        this.color = color; */}
            </form>
            <style>
                {`
                    .product-form-container {
                        background-color: grey;
                        min-height: 20em;
                    }
                    .product-form {
                        display: flex;
                        flex-direction: column;
                    }
                    .product-form-label {
                        background-color: white;
                        border: 2px solid grey;
                        border-radius: 1em;
                    }
                    .product-form-input { 
                        padding: 0.5em 1em;
                    }
                `}
            </style>
        </div>
    );
};
