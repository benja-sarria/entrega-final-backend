import { SyntheticEvent, useContext, useEffect, useState } from "react";
import { CartInterface } from "../../../../src/interfaces/CartInterface";
import { ProductsInterface } from "../../../../src/interfaces/ProductsContextInterface";
import { ProductContext } from "../context/ProductContextProvider";
import { ProductCardComponent } from "../ProductCardComponent/ProductCardComponent";
import style from "./ProductListContainer.module.scss";

export const ProductListContainer = () => {
    const { products } = useContext(ProductContext);

    const [fetchedProducts, setFetchedProducts] = useState<ProductsInterface[]>(
        []
    );

    const handleAdd = async (product: ProductsInterface) => {
        console.log(product);
        const cart = sessionStorage.getItem("cart");
        if (cart) {
            const parsedCart: CartInterface = JSON.parse(cart);
            parsedCart.products.push(product);
            const rawResponse = await fetch(
                `http://localhost:8081/api/cart/update/${parsedCart._id}`,
                {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify(parsedCart),
                    headers: {
                        "Content-type": "application/json",
                    },
                }
            );
            const parsedResponse = await rawResponse.json();
            console.log(parsedResponse);
            if (parsedResponse.data) {
                sessionStorage.setItem(
                    "cart",
                    JSON.stringify(parsedResponse.data)
                );
                location.reload();
            }
        }
    };

    useEffect(() => {
        console.log(products);
        if (products?.length) setFetchedProducts([...products]);
    }, [products]);

    return (
        <div className={`${style["product-list-container"]}`}>
            {fetchedProducts.map((product, index) => {
                return (
                    <div key={index}>
                        <ProductCardComponent
                            product={product}
                            handleAdd={handleAdd}
                        />
                    </div>
                );
            })}
        </div>
    );
};
