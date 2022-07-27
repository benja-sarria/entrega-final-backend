import { useEffect, useState } from "react";
import { ProductInterface } from "../../../../src/interfaces/ProductsDaoInterface";

export const ProductDetailContainer = ({ id }: { id: string }) => {
    const [productDetail, setProductDetail] = useState<ProductInterface>();
    const [stockQuantity, setStockQuantity] = useState<string[]>([]);

    const fetchProduct = async (id: string) => {
        if (id) {
            const rawResponse = await fetch(
                `http://localhost:8081/api/products/search/${id}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            const parsedResponse = await rawResponse.json();
            console.log(parsedResponse);
            if (parsedResponse.data) {
                setProductDetail(parsedResponse.data);
                const accumulator = [];
                for (
                    let index = 0;
                    +index < +parsedResponse.data.stock;
                    index++
                ) {
                    accumulator.push("a");
                }
                setStockQuantity([...accumulator]);
            }
        }
    };

    useEffect(() => {
        console.log(id);

        fetchProduct(id);
    }, [id]);

    useEffect(() => {}, [productDetail]);

    return (
        <div>
            <div>
                <h2>{productDetail?.name}</h2>
                <img src={productDetail?.img} alt={productDetail?.name} />
                <h3>Precio: ${productDetail?.price}</h3>
                <h4>Color: {productDetail?.color}</h4>
                <h5>Stock: {productDetail?.stock}</h5>
            </div>
            <label htmlFor="quantity">
                Elige la cantidad
                <select name="quantity" id="">
                    {stockQuantity.map((option, index) => {
                        return (
                            <option key={index} value={index + 1}>
                                {index + 1}
                            </option>
                        );
                    })}
                </select>
            </label>
        </div>
    );
};
