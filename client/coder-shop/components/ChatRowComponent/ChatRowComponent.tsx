import MessageInterface from "../../../../src/interfaces/MessageInterface";
import moment from "moment";

moment.locale("es");

export const ChatRowComponent = ({
    message,
}: {
    message: MessageInterface;
}) => {
    return (
        <div>
            <p>
                <span>{message.email}</span> <span>{message.message}</span>{" "}
                <span>{moment(message.createdAt).format("llll")}</span>{" "}
                <span>
                    <i>{message.type}</i>
                </span>
            </p>
        </div>
    );
};
