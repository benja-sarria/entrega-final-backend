import { env } from "../../config/config";
import { ProductInterface } from "../../interfaces/ProductsDaoInterface";
import { DAOSFactory } from "../../models/daos/daos.factory";
import { ProductMongoDAO } from "../../models/daos/products/product.mongo.dao";
import { ProductSchema } from "../../models/schemas/products/products.schema";
import { STATUS } from "../../utils/constants/api.constants";
import { CustomError } from "../../utils/errors/customError";

export class ProductServices {
    productsDAO: any;
    static async #validateProduct(product: ProductInterface) {
        try {
            return await ProductSchema.validate(product);
        } catch (error) {
            throw new CustomError(
                STATUS.BAD_REQUEST,
                `Validation error`,
                `${error}`
            );
        }
    }
    // productDao tiene que ser DAOSFactory.getDAOS(env.DATA_SOURCE).productDAO
    constructor(productDao: ProductMongoDAO) {
        this.productsDAO = productDao;
    }

    async getProductsService() {
        return await this.productsDAO.getAllProducts();
    }
    async getProductByIdService(id: string) {
        if (!id) {
            throw new CustomError(STATUS.BAD_REQUEST, `Invalid id`);
        }
        return await this.productsDAO.getProductById(id);
    }
    async getProductByCategoryService(category: string) {
        if (!category) {
            throw new CustomError(STATUS.BAD_REQUEST, `Invalid id`);
        }
        return await this.productsDAO.getProductByCategory(category);
    }

    async createProductService(product: ProductInterface) {
        console.log(product);

        const validatedProduct = await ProductServices.#validateProduct(
            product
        );
        console.log("[VALIDATED-PRODUCT] => ", validatedProduct);

        return await this.productsDAO.saveProduct(validatedProduct);
    }
    async updateProductService(id: string, product: ProductInterface) {
        if (!id) {
            throw new CustomError(STATUS.BAD_REQUEST, `Invalid id`);
        }
        return await this.productsDAO.updateProduct(id, product);
    }
    async deleteProductService(id: string) {
        if (!id) {
            throw new CustomError(STATUS.BAD_REQUEST, `Invalid id`);
        }
        return await this.productsDAO.removeProduct(id);
    }
}
