import { ProductInterface } from "../../../interfaces/ProductsDaoInterface";

export const HomeScreenComponent = ({
    productsState,
}: {
    productsState: any;
}) => {
    return (
        <div>
            {productsState.map((product: any) => {
                return (
                    <div>
                        <h3>{`${product.name}`}</h3>
                    </div>
                );
            })}
        </div>
    );
};
