import appInsights = require("applicationinsights");

import { UsersRepository } from "./src/repositories/users-repository";

import { DependencyManager } from "./src/services/managers/dependency-manager";

import { DataRunningConfiguration } from "./src/services/managers/data-runner";
import { DatabaseManager } from "./src/services/managers/database-manager";

if (process.env.PRODUCTION == "false") {
  // tslint:disable-next-line:no-var-requires
  require("dotenv").load();
} else {
  require('dotenv').config({ path: '/home/thluiz/webapps/api_node/.env' });
  appInsights.setup(process.env.AZURE_APP_INSIGHTS);
  appInsights.start();
}

import "reflect-metadata";
import { ErrorCode } from "./src/helpers/errors-codes";

import * as old_routes from "./src/initializers/old-routes";
import * as passport from "./src/initializers/passport";
import * as routes from "./src/initializers/routes";

import { LoggerService, LogOrigins } from "./src/services/logger-service";

process.on("unhandledRejection", (reason, p) => {
  const error = new Error("Unhandled Rejection");
  LoggerService.error(ErrorCode.UnhandledRejection, error, { reason, p });
});

process.on("uncaughtException", (error) => {
  LoggerService.error(ErrorCode.UncaughtException, error);
});

import bodyParser = require("body-parser");
import cors = require("cors");
import express = require("express");
import helmet = require("helmet");

const container = DependencyManager.container;

class ServerDataRunningConfiguration extends DataRunningConfiguration {
  constructor() {
    super();
    this.shouldCommit = true;
    this.useTransaction = true;
  }
}

container
  .bind<DatabaseManager>(DatabaseManager)
  .toSelf()
  .inSingletonScope();

container
  .bind<DataRunningConfiguration>(ServerDataRunningConfiguration)
  .to(DataRunningConfiguration);

const app = express();
const port = process.env.port || process.env.PORT || 3979;

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || (process.env.CORS_ALLOWED_ORIGINS.split(",") as any).includes(origin)) {
      callback(null, true);
    } else {
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
  const path = "index.html";
  res.sendfile(path, { root: "./apex/public" });
});

app.use(express.static("./apex/public"));

app.listen(port, async () => {
  if (process.env.PRODUCTION == "false") {
    await WarmUserCaches();
  }

  LoggerService.info(LogOrigins.General, `server listening to ${port}`);
});

// Warm user caches for preventing timeouts
async function WarmUserCaches() {
  const UR = new UsersRepository();
  const users = await (await UR.getRepository()).find();

  for (const user of users) {
    await UR.getUserByEmail(user.email);
    await UR.getUserByToken(user.token);
    await UR.loadAllUserData(user.id);
  }
}
