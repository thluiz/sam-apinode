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
const appInsights = require("applicationinsights");
const users_repository_1 = require("./src/repositories/users-repository");
const dependency_manager_1 = require("./src/services/managers/dependency-manager");
const data_runner_1 = require("./src/services/managers/data-runner");
const database_manager_1 = require("./src/services/managers/database-manager");
if (process.env.PRODUCTION != "true") {
    // tslint:disable-next-line:no-var-requires
    require("dotenv").load();
}
else {
    require('dotenv').config({ path: process.env.CONFIG_FILE });
    appInsights.setup(process.env.AZURE_APP_INSIGHTS);
    appInsights.start();
}
for (var i in process.env) {
    console.log(`${i}=${process.env[i]}`);
}
require("reflect-metadata");
const errors_codes_1 = require("./src/helpers/errors-codes");
const old_routes = require("./src/initializers/old-routes");
const passport = require("./src/initializers/passport");
const routes = require("./src/initializers/routes");
const logger_service_1 = require("./src/services/logger-service");
process.on("unhandledRejection", (reason, p) => {
    const error = new Error("Unhandled Rejection");
    logger_service_1.LoggerService.error(errors_codes_1.ErrorCode.UnhandledRejection, error, { reason, p });
});
process.on("uncaughtException", (error) => {
    logger_service_1.LoggerService.error(errors_codes_1.ErrorCode.UncaughtException, error);
});
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const container = dependency_manager_1.DependencyManager.container;
class ServerDataRunningConfiguration extends data_runner_1.DataRunningConfiguration {
    constructor() {
        super();
        this.shouldCommit = true;
        this.useTransaction = true;
    }
}
container
    .bind(database_manager_1.DatabaseManager)
    .toSelf()
    .inSingletonScope();
container
    .bind(ServerDataRunningConfiguration)
    .to(data_runner_1.DataRunningConfiguration);
const app = express();
const port = process.env.port || process.env.PORT || 3979;
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || process.env.CORS_ALLOWED_ORIGINS.split(",").includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
};
app.use(helmet());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
passport.initialize(app);
old_routes.initialize(app);
routes.initialize(app, "./src/routes");
app.get(/^((?!\.).)*$/, (req, res) => {
    res.redirect("https://site.myvtmi.im");
});
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.PRODUCTION == "false") {
        yield WarmUserCaches();
    }
    logger_service_1.LoggerService.info(logger_service_1.LogOrigins.General, `server listening to ${port}`);
}));
// Warm user caches for preventing timeouts
function WarmUserCaches() {
    return __awaiter(this, void 0, void 0, function* () {
        const UR = new users_repository_1.UsersRepository();
        const users = yield (yield UR.getRepository()).find();
        for (const user of users) {
            yield UR.getUserByEmail(user.email);
            yield UR.getUserByToken(user.token);
            yield UR.loadAllUserData(user.id);
        }
    });
}
//# sourceMappingURL=server.js.map