import passport from "passport";
import { UsersInterface } from "../../interfaces/UsersInterface";
const LocalStrategy = require("passport-local").Strategy;
import bcrypt from "bcrypt";
import { env } from "../../config/config";
import { UserServices } from "../../services/users/users.services";
import { DAOSFactory } from "../../models/daos/daos.factory";

const salt = () => {
    return bcrypt.genSaltSync(10);
};
const createHash = (password: string) => {
    return bcrypt.hashSync(password, salt());
};

const isValidPassword = (user: UsersInterface, password: string) => {
    if (user.password) {
        return bcrypt.compareSync(password, user.password);
    } else {
        return false;
    }
};

passport.use(
    "register",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
        },
        async (req: any, email: string, password: string, done: any) => {
            try {
                // const user = await UserModel.create({ email, password });

                const service = new UserServices(
                    DAOSFactory.getDAOS(env.DATA_SOURCE).userDao
                );
                const userToAdd = req.body;
                userToAdd.password = createHash(userToAdd.password);
                const createdUser = await service.createUserService(userToAdd);
                console.log("[CREATED-USER] => ", createdUser);
                if (createdUser.password) {
                    return done(null, createdUser);
                } else {
                    return done(null, false);
                }
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    "login",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email: string, password: string, done: any) => {
            try {
                const service = new UserServices(
                    DAOSFactory.getDAOS(env.DATA_SOURCE).userDao
                );
                const searchedUser = await service.getUserByEmailService(email);
                // const user = await UserModel.findOne({ email });

                if (!searchedUser) {
                    return done(null, false, { message: "User not found" });
                }

                const validate = await isValidPassword(searchedUser, password);

                if (!validate) {
                    return done(null, false, { message: "Wrong Password" });
                }

                return done(null, searchedUser, {
                    message: "Logged in Successfully",
                });
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Serialización - Passport cuando guarda los usuarios realiza este proceso
passport.serializeUser((user: any, done) => {
    console.log("Inside serializer");
    done(null, user._id);
});

// Deserialización - Passport cuando lee los usuarios realiza este proceso
passport.deserializeUser(async (id: string, done) => {
    console.log("Inside deserializer");
    const service = new UserServices(
        DAOSFactory.getDAOS(env.DATA_SOURCE).userDao
    );
    const searchedUser = await service.getUserByIdService(id);

    done(null, searchedUser);
});

export default passport;
