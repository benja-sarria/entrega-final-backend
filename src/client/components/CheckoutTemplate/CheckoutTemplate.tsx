import { ProductInterface } from "../../../interfaces/ProductsDaoInterface";

export const CheckoutTemplate = ({
    products,
    orderNumber,
}: {
    products: any;
    orderNumber: number | undefined;
}) => {
    return (
        <div>
            <h3>Order #{orderNumber}</h3>
            <ul>
                {products?.map((product: any, index: number) => {
                    return (
                        <li key={index}>
                            <div>
                                <h3>
                                    Product: <span>{product.name}</span>
                                </h3>
                                <p>
                                    Price: <span>{product.price}</span>
                                </p>
                                <p>
                                    Color: <span>{product.color}</span>
                                </p>
                                <div>
                                    Image:
                                    <img src={product.img} alt={product.name} />
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
