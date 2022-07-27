import { SyntheticEvent, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { ChatRowComponent } from "../ChatRowComponent/ChatRowComponent";
import { UserContext } from "../context/UserContextProvider";

export const ChatComponent = () => {
    const [messages, setMessages] = useState<any[]>([]);

    const { user } = useContext(UserContext);

    const socket = io("http://localhost:3001/", {
        withCredentials: false,
        extraHeaders: {
            "my-custom-header": "abcd",
        },
    });

    const socketInitializer = async () => {
        const socket = io("http://localhost:3001/", {
            withCredentials: false,
            extraHeaders: {
                "my-custom-header": "abcd",
            },
        });

        socket.on("messages", (msg) => {
            setMessages([...msg]);
        });
    };

    const handleMessage = (message: any) => {
        setMessages(message);
        /*   this.setState((state) => ({
            messages: state.messages.concat(message),
        })); */
    };

    const handleChatSubmit = (e: any) => {
        e.preventDefault();

        socket.emit("message", {
            email: e.target.email.value,
            message: e.target.message.value,
        });
        socket.on("messages", (msg) => {
            setMessages([...msg]);
        });
    };

    /*  useEffect(() => {
        socket.on("message", handleMessage);
        return () => {
            socket.off("message", handleMessage);
            socket.close();
        };
    }, []);
 */
    useEffect(() => {}, [messages, user]);

    useEffect(() => {
        socketInitializer();
    }, []);

    return (
        <div>
            <div>
                {messages.map((message, index) => {
                    return (
                        <div key={index}>
                            <ChatRowComponent message={message} />
                        </div>
                    );
                })}
            </div>
            <form action="" onSubmit={handleChatSubmit}>
                <input type="email" name="email" value={user?.email} />
                <textarea
                    name="message"
                    id="message"
                    cols={30}
                    rows={10}
                ></textarea>
                <input type="submit" />
            </form>
        </div>
    );
};
