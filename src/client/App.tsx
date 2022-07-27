import axios from "axios";
import React, { useEffect, useState } from "react";
import { env } from "../config/config";
import { ProductsInterface } from "../interfaces/ProductsContextInterface";
import { DAOSFactory } from "../models/daos/daos.factory";
import { ProductServices } from "../services/products/products.services";
import { CheckoutTemplate } from "./components/CheckoutTemplate/CheckoutTemplate";
import { ErrorViewComponent } from "./components/ErrorViewComponent/ErrorViewComponent";

import { HomeScreenComponent } from "./components/HomeScreenComponent/HomeScreenComponent";
import { LoginFormComponent } from "./components/LoginFormComponent/LoginFormComponent";
import { ProductsFormComponent } from "./components/ProductsForm/ProductsFormComponent";
import { UserRegistrationFormComponent } from "./components/UserRegistrationFormComponent/UserRegistrarionFormComponent";

const ReactApp = ({
    type,
    products,
    orderNumber,
    errorResponse,
}: {
    type: string;
    products?: ProductsInterface[];
    orderNumber?: number;
    errorResponse?: any;
}): JSX.Element => {
    const [productsState, setProducts] = useState<ProductsInterface[]>([]);

    const fetchProducts = async () => {
        const service = new ProductServices(
            DAOSFactory.getDAOS(env.DATA_SOURCE).productDao
        );
        const rawProducts =
            (await service.getProductsService()) as ProductsInterface[];
        console.log(rawProducts);
        setProducts(rawProducts);
    };

    useEffect(() => {
        try {
            fetchProducts();
        } catch (error) {}
    }, []);

    useEffect(() => {}, [productsState]);

    useEffect(() => {
        console.log(type);
    }, [type]);

    return (
        <div>
            {type === "product" ? (
                <ProductsFormComponent />
            ) : type === "user" ? (
                <UserRegistrationFormComponent />
            ) : type === "login" ? (
                <LoginFormComponent />
            ) : type === "homeScreen" ? (
                <HomeScreenComponent productsState={productsState} />
            ) : type === "checkout" ? (
                <CheckoutTemplate
                    products={products}
                    orderNumber={orderNumber}
                />
            ) : type === "error" ? (
                <ErrorViewComponent errorResponse={errorResponse} />
            ) : (
                <div></div>
            )}
        </div>
    );
};

export default ReactApp;
