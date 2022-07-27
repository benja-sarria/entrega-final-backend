export interface ProductInterface {
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    img: string;
    color: string;
    createdAt?: number;
    updatedAt?: number;
}

export interface DatabaseInstancesInterface {
    [instance: string]: any;
}
