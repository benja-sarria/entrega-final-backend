import path from "path";
import dotenv from "dotenv";

import yargs from "yargs/yargs";
const args: any = yargs(process.argv.slice(2))
    .default({
        NODE_ENV: "development",
        PORT: "8080",
        STORAGE: "mongo",
    })
    .alias({
        n: "NODE_ENV",
        p: "PORT",
        s: "STORAGE",
    }).argv;

console.log(args);

dotenv.config({ path: `.env.${args.NODE_ENV}` });

export const env = {
    NODE_ENV: process.env.NODE_ENV || "",
    HOST: process.env.HOST || "localhost",
    PORT: args.PORT ? args.PORT : process.env.PORT || 8080,
    DATA_SOURCE: process.env.DATA_SOURCE || "mongo",
    MONGO_ATLAS_ACCOUNT: process.env.MONGO_ATLAS_ACCOUNT || "",
    MONGO_ATLAS_PASS: process.env.MONGO_ATLAS_PASS || "",
    SESSION_DB: process.env.SESSION_DB || "",
    SESSION_SECRET: process.env.SESSION_SECRET || "",
    JWT_SECRET: process.env.JWT_SECRET || "secret",
    GMAIL_USER: process.env.GMAIL_USER || "",
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD || "",
};
