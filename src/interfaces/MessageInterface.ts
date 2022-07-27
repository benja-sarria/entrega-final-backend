export interface MessageInterface {
    _id?: string;
    email: string;
    message: string;
    type: string;
    createdAt?: number;
    updatedAt?: number;
}

export default MessageInterface;
