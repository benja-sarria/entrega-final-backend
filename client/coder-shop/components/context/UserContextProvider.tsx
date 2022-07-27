import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { UsersInterface } from "../../../../src/interfaces/UsersInterface";
import { CartInterface } from "../../../../src/interfaces/CartInterface";

export const UserContext = createContext<{
    user?: UsersInterface;
    cart?: CartInterface;
}>({});

export const UserContextProvider = ({ children }: { children: any }) => {
    const [user, setUser] = useState<UsersInterface>();
    const [cart, setCart] = useState<CartInterface>();

    const fetchUser = async () => {
        const rawUser = await fetch("http://localhost:8081/api/users/search", {
            method: "GET",
            credentials: "include",
        });
        const parsedUser = await rawUser.json();

        console.log("[PARSED-USER] => ", parsedUser);
        if (parsedUser.statusCode === 200) {
            console.log("No hay error");

            setUser({ ...parsedUser.data });

            const sessionStorageCart = sessionStorage.getItem("cart");
            if (sessionStorageCart) {
                const parsedSessionStorageCart = JSON.parse(sessionStorageCart);
                setCart(parsedSessionStorageCart);
            } else {
                const existingCart = await fetch(
                    "http://localhost:8081/api/cart/search",
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );
                const parsedExistingCart = await existingCart.json();
                if (parsedExistingCart.status === 404) {
                    const rawCartResponse = await fetch(
                        "http://localhost:8081/api/cart/create",
                        {
                            method: "GET",
                            credentials: "include",
                        }
                    );
                    const parsedCartResponse = await rawCartResponse.json();
                    console.log(parsedCartResponse);
                    sessionStorage.setItem(
                        "cart",
                        JSON.stringify(parsedCartResponse.data)
                    );
                    setCart(parsedCartResponse.data);
                } else {
                    sessionStorage.setItem(
                        "cart",
                        JSON.stringify(parsedExistingCart.data)
                    );
                    setCart(parsedExistingCart.data);
                }
            }
        } else {
            console.log("NOT LOGGED IN");

            window.location.href = "http://localhost:8081";
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        console.log(user);
    }, [user]);

    return (
        <UserContext.Provider
            value={{
                user,
                cart,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
