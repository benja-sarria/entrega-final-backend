import Image from "next/image";
import { useRouter } from "next/router";
import { MouseEventHandler } from "react";
import { ProductsInterface } from "../../../../src/interfaces/ProductsContextInterface";
import style from "./ProductCardComponent.module.scss";

export const ProductCardComponent = ({
    product,
    handleAdd,
}: {
    product: ProductsInterface;
    handleAdd: Function;
}) => {
    const router = useRouter();

    return (
        <div className={style["product-card-container"]}>
            <div className={style["product-card-heading"]}>
                <div className={style["image-container"]}>
                    {/* <Image src={`${product.img}`} layout="fill" /> */}
                </div>
                <div className={style["product-card-text-contents"]}>
                    <h3
                        className={style["product-card-title"]}
                    >{`${product.name}`}</h3>
                    <p className={style["product-card-price"]}>
                        ${`${product.price}`}
                    </p>
                </div>
                <div>
                    <button
                        onClick={() => {
                            handleAdd(product);
                        }}
                    >
                        Agregar al Carrito
                    </button>
                    <button
                        onClick={() => {
                            router.push(`/detail/${product._id}`);
                        }}
                    >
                        Ver Detalle
                    </button>
                </div>
            </div>
        </div>
    );
};
