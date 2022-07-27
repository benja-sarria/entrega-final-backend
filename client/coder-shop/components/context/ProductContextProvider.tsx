import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { ProductsInterface } from "../../../../src/interfaces/ProductsContextInterface";

export const ProductContext = createContext<{ products?: ProductsInterface[] }>(
    {}
);

export const ProductContextProvider = ({ children }: { children: any }) => {
    const [products, setProducts] = useState<ProductsInterface[]>([]);

    const fetchProducts = async () => {
        const rawProducts = await fetch(
            "http://localhost:8081/api/products/allProducts"
        );
        const parsedProducts = await rawProducts.json();

        console.log(parsedProducts);
        if (!parsedProducts.error) {
            console.log("No hay error");

            setProducts([...parsedProducts.data]);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        console.log(products);
    }, [products]);

    return (
        <ProductContext.Provider
            value={{
                products,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};
