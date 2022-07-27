import express, { NextFunction, Request, Response } from "express";
const { createServer } = require("http");
import { Server } from "socket.io";
import { router } from "./routers/app.router.";
import { env } from "./config/config";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import cors from "cors";
import cookieParser from "cookie-parser";
import { allowAccess } from "./middlewares/allowAccess.middleware";
import { MessagesServices } from "./services/messages/messages.services";
import { DAOSFactory } from "./models/daos/daos.factory";
const handlebars = require("express-handlebars").create({
    defaultLayout: "main",
});

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
    },
});
app.engine("handlebars", handlebars.engine);
app.set("views", `${process.cwd()}/src/views`);
app.set("view engine", "handlebars");

// App Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));
app.use(
    session({
        name: "coder-session",
        secret: env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: `mongodb+srv://${env.MONGO_ATLAS_ACCOUNT}:${env.MONGO_ATLAS_PASS}@coderhouse-ecommerce.rogfv.mongodb.net/${process.env.SESSION_DB}?retryWrites=true&w=majority`,
        }),
        cookie: {
            maxAge: 600000,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(allowAccess);
app.use(
    cors({
        origin: "http://localhost:3000",
        optionsSuccessStatus: 200, // For legacy browser support
    })
);

// Routes
app.use("/api", router);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        res.redirect("/api/users/login");
    } else {
        res.redirect("http://localhost:3000/");
    }
});

app.get("/config", (req, res) => {
    //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
    const { NODE_ENV, PORT, DATA_SOURCE } = env;
    res.render("main", {
        layout: "index",
        configs: { ENV: NODE_ENV, PORT: PORT, DATA: DATA_SOURCE },
    });
});

app.listen(env.PORT, () => {
    console.log(
        `[${env.NODE_ENV.trim()}] Using ${
            env.DATA_SOURCE
        } as project's data source`
    );
    console.log(
        `[${env.NODE_ENV.trim()}] Server up and running on port ${env.PORT}`
    );
});

app.on("error", (error) => {
    console.log(`There has been an unexpected error in the server`);
    console.log(error);
});

io.on("connection", async (socket) => {
    try {
        console.log("new socket connected");
        const messagesService = new MessagesServices(
            DAOSFactory.getDAOS(env.DATA_SOURCE).messagesDao
        );

        const allMessages = await messagesService.getMessagesService();

        socket.emit("messages", allMessages);
        socket.on("message", async (message) => {
            try {
                const newMessage = await messagesService.createMessageService(
                    message
                );

                const allMessages = await messagesService.getMessagesService();
                socket.emit("messages", allMessages);
            } catch (error) {}
        });
    } catch (error) {}
});
httpServer.listen(3001);
