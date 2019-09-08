import { LoggerService, LogOrigins } from "./../services/logger-service";
import passport = require("passport");

import session = require("express-session");
import * as jwt from "jsonwebtoken";
import { AzureSessionStore } from "../middlewares/azure-session-storage";

import { User } from "../entity/User";
import { UsersRepository } from "../repositories/users-repository";

import { ErrorCode } from "../helpers/errors-codes";
import { ErrorResult, SuccessResult, Result } from "../helpers/result";
import { SecurityService } from "../services/security-service";

// tslint:disable-next-line:no-var-requires
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// tslint:disable-next-line:no-var-requires
const LocalStrategy = require("passport-local").Strategy;

export function initialize(app) {
  const UR = new UsersRepository();
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
      },
      async (accessToken, refreshToken, profile, cb) => {
        const resultUser = await UR.getUserByEmail(profile.emails[0].value);

        if (resultUser == null || !resultUser.success) {
          cb(null, false);
          return;
        }

        cb(null, resultUser.data);
      }
    )
  );

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      async (email, password, done) => {
        doLoginCallback(email, password, done);
      }
    )
  );

  passport.serializeUser((user: User, done) => {
    done(null, user.token);
  });

  passport.deserializeUser(async (token, done) => {
    const ru = await UR.getUserByToken(token);

    if ((ru == null || !ru.success) && done) {
      done("USER_NOT_FOUND", false);
      return;
    }

    if (done) {
      done(null, ru.data);
      return;
    }
  });

  app.use(
    session({
      secret: process.env.EXPRESS_SESSION_KEY,
      resave: true,
      saveUninitialized: true,
      cookie: {
        secure: false,
        httpOnly: true
      },
      store: new AzureSessionStore({
        secret: process.env.EXPRESS_SESSION_KEY,
        resave: true,
        maxAge: 6 * 60 * 60 * 1000, // 6 hours
        saveUninitialized: true
      })
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login_error" }),
    (req, res) => {
      res.redirect(process.env.SITE_URL + "/security/load_login");
    }
  );

  app.get(
    "/oauth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login_error" }),
    (req, res) => {
      res.redirect(process.env.SITE_URL + "/security/load_login");
    }
  );

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

    res.send(SuccessResult.GeneralOk(token));
  });

  app.post("/api/auth/login", async (req, res, next) => {
    const loginResult = await doLogin(req.body.email, req.body.password);

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
  });

  async function doLogin(email, password): Promise<Result<User>> {
    const resultUser = await UR.getUserByEmailWithoutCache(email);

    if (!resultUser || !resultUser.success || !resultUser.data) {
      return ErrorResult.Fail(
        ErrorCode.GenericError,
        new Error("User Not Found #1")
      );
    }

    const user = resultUser.data as User;
    const person = await user.getPerson(false);

    if (
      SecurityService.sha512(password, person.salt)
        .passwordHash !== person.password
    ) {
      return ErrorResult.Fail(
        ErrorCode.GenericError,
        new Error(`User Not Found #2`)
      );
    }

    return SuccessResult.GeneralOk(user);
  }

  function doLoginCallback(email, password, done: (error, user) => void) {
    doLogin(email, password).then(result => {
      if (!result.success) {
        const error = result as ErrorResult;

        done(error.data, null);
      } else {
        const success = result as ErrorResult;

        done(null, success.data);
      }
    });
  }
}
