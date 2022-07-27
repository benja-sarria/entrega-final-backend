import { env } from "../config/config";

export const dbConfig = {
    mongo: {
        uri: `mongodb+srv://${env.MONGO_ATLAS_ACCOUNT}:${env.MONGO_ATLAS_PASS}@coderhouse-ecommerce.rogfv.mongodb.net/?retryWrites=true&w=majority`,
    },
};
