"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const azure_session_storage_1 = require("../middlewares/azure-session-storage");
const users_repository_1 = require("../repositories/users-repository");
const errors_codes_1 = require("../helpers/errors-codes");
const result_1 = require("../helpers/result");
const security_service_1 = require("../services/security-service");
// tslint:disable-next-line:no-var-requires
const GoogleStrategy = require("passport-google-oauth20").Strategy;
// tslint:disable-next-line:no-var-requires
const LocalStrategy = require("passport-local").Strategy;
function initialize(app) {
    const UR = new users_repository_1.UsersRepository();
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    }, (accessToken, refreshToken, profile, cb) => __awaiter(this, void 0, void 0, function* () {
        const resultUser = yield UR.getUserByEmail(profile.emails[0].value);
        if (resultUser == null || !resultUser.success) {
            cb(null, false);
            return;
        }
        cb(null, resultUser.data);
    })));
    passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, (email, password, done) => __awaiter(this, void 0, void 0, function* () {
        doLoginCallback(email, password, done);
    })));
    passport.serializeUser((user, done) => {
        done(null, user.token);
    });
    passport.deserializeUser((token, done) => __awaiter(this, void 0, void 0, function* () {
        const ru = yield UR.getUserByToken(token);
        if ((ru == null || !ru.success) && done) {
            done("USER_NOT_FOUND", false);
            return;
        }
        if (done) {
            done(null, ru.data);
            return;
        }
    }));
    app.use(session({
        secret: process.env.EXPRESS_SESSION_KEY,
        resave: true,
        saveUninitialized: true,
        cookie: {
            secure: false,
            httpOnly: true
        },
        store: new azure_session_storage_1.AzureSessionStore({
            secret: process.env.EXPRESS_SESSION_KEY,
            resave: true,
            maxAge: 6 * 60 * 60 * 1000,
            saveUninitialized: true
        })
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
    app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login_error" }), (req, res) => {
        res.redirect(process.env.SITE_URL + "/security/load_login");
    });
    app.get("/oauth/google/callback", passport.authenticate("google", { failureRedirect: "/login_error" }), (req, res) => {
        res.redirect(process.env.SITE_URL + "/security/load_login");
    });
    app.get("/relogin", (req, res) => {
        req.logout();
        res.redirect(process.env.SITE_URL);
    });
    app.get("/logout", (req, res) => {
        req.logout();
        res.redirect(process.env.SITE_URL);
    });
    app.get("api/auth/logout", (req, res) => {
        req.logout();
        res.redirect(process.env.SITE_URL);
    });
    app.get("api/auth/token", (req, res) => {
        const expiresIn = process.env.JWT_TOKEN_LIFE_TIME || "2 minutes";
        const payload = { token: req.user.token, permissions: [] };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn
        });
        res.send(result_1.SuccessResult.GeneralOk(token));
    });
    app.post("/api/auth/login", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const loginResult = yield doLogin(req.body.email, req.body.password);
        if (!loginResult.success) {
            res.send(loginResult);
            return;
        }
        req.login(loginResult.data, err => {
            if (err) {
                return next(err);
            }
            res.send(loginResult);
        });
    }));
    function doLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultUser = yield UR.getUserByEmailWithoutCache(email);
            if (!resultUser || !resultUser.success || !resultUser.data) {
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, new Error("User Not Found #1"));
            }
            const user = resultUser.data;
            const person = yield user.getPerson(false);
            if (security_service_1.SecurityService.sha512(password, person.salt)
                .passwordHash !== person.password) {
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, new Error(`User Not Found #2`));
            }
            return result_1.SuccessResult.GeneralOk(user);
        });
    }
    function doLoginCallback(email, password, done) {
        doLogin(email, password).then(result => {
            if (!result.success) {
                const error = result;
                done(error.data, null);
            }
            else {
                const success = result;
                done(null, success.data);
            }
        });
    }
}
exports.initialize = initialize;
//# sourceMappingURL=passport.js.map