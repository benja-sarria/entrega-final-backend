import { useContext } from "react";
import { ProductInterface } from "../../../../src/interfaces/ProductsDaoInterface";
import { UserContext } from "../context/UserContextProvider";

export const NavbarComponent = () => {
    const { user, cart } = useContext(UserContext);

    const handleDelete = async (product: ProductInterface) => {
        if (cart?.products) {
            const filteredCart =
                cart?.products.filter((cartProduct) => {
                    return cartProduct.name !== product.name;
                }).length > 0
                    ? cart?.products.filter((cartProduct) => {
                          return cartProduct.name !== product.name;
                      })
                    : [];
            const rawResponse = await fetch(
                `http://localhost:8081/api/cart/update/${cart._id}`,
                {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify({
                        ...cart,
                        products: [...filteredCart],
                    }),
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

    console.log(cart);

    return (
        <div>
            <div>
                <h3>
                    {`${user?.hasOwnProperty("name") ? user?.name : ""} `}
                    {`${
                        user?.hasOwnProperty("lastName") ? user?.lastName : ""
                    }`}
                </h3>
            </div>
            <div>Productos en Carrito: {cart?.products.length}</div>
            <ul>
                {cart?.products && cart?.products.length > 0
                    ? cart?.products.map((product, index) => {
                          return (
                              <li key={index}>
                                  <p>{product.name}</p>
                                  <button
                                      onClick={() => {
                                          handleDelete(product);
                                      }}
                                  >
                                      Eliminar
                                  </button>
                              </li>
                          );
                      })
                    : ""}
            </ul>
            <button
                onClick={async () => {
                    const rawResponse = await fetch(
                        `http://localhost:8081/api/cart/checkout/${cart?._id}`,
                        {
                            method: "GET",
                            credentials: "include",
                        }
                    );
                    setTimeout(() => {
                        sessionStorage.removeItem("cart");
                        window.location.href = "http://localhost:8081";
                    }, 4000);
                }}
            >
                Checkout
            </button>
            <div>
                <button
                    onClick={async () => {
                        const rawResponse = await fetch(
                            `http://localhost:8081/api/users/logout`,
                            {
                                method: "GET",
                                credentials: "include",
                            }
                        );
                        setTimeout(() => {
                            window.location.href = "http://localhost:8081";
                        }, 2000);
                    }}
                >
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};
