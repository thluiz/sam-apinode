"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
const util_1 = require("util");
const await_to_js_1 = require("await-to-js");
const inversify_1 = require("inversify");
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const errors_codes_1 = require("../../helpers/errors-codes");
const result_1 = require("../../helpers/result");
const data_runner_1 = require("./data-runner");
const dependency_manager_1 = require("./dependency-manager");
let connection = null;
function getGlobalConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!connection) {
            connection = yield typeorm_1.createConnection({
                type: "mssql",
                extra: { options: { encrypt: true } },
                host: process.env.SQL_HOST,
                username: process.env.SQL_USER,
                password: process.env.SQL_PASSWORD,
                database: process.env.SQL_DATABASE,
                logging: process.env.SQL_SHOW_LOGGING === "true",
                synchronize: false,
                entities: ["src/entity/*.js"],
                subscribers: ["src/subscriber/*.js"],
                migrations: ["src/migration/*.js"],
                connectionTimeout: 30000,
                requestTimeout: 30000,
                pool: {
                    max: 100,
                    min: 1,
                    idleTimeoutMillis: 15000,
                    acquireTimeoutMillis: 0
                },
                cli: {
                    entitiesDir: "entity",
                    migrationsDir: "migration",
                    subscribersDir: "subscriber"
                }
            });
        }
        return connection;
    });
}
let DatabaseManager = class DatabaseManager {
    getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            return getGlobalConnection();
        });
    }
    getRepository(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const manager = (yield getGlobalConnection()).manager;
            return yield manager.getRepository(type);
        });
    }
    CreateQueryRunner() {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield getGlobalConnection();
            const queryRunner = conn.createQueryRunner();
            if (!queryRunner.connection.isConnected) {
                yield queryRunner.connection.connect();
            }
            return queryRunner;
        });
    }
    StartTransaction(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.startTransaction();
            return queryRunner;
        });
    }
    CommitTransaction(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            queryRunner.commitTransaction();
        });
    }
    RollbackTransaction(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            queryRunner.rollbackTransaction();
        });
    }
    ExecuteWithinTransaction(fun, queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            if (queryRunner) {
                return fun(queryRunner);
            }
            const conn = yield getGlobalConnection();
            queryRunner = conn.createQueryRunner();
            try {
                yield queryRunner.startTransaction();
                const result = yield fun(queryRunner);
                yield queryRunner.commitTransaction();
                return result;
            }
            catch (error) {
                yield queryRunner.rollbackTransaction();
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        });
    }
    ExecuteSPNoResults(procedure, ...parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            const [connError, conn] = yield await_to_js_1.default(getGlobalConnection());
            if (connError) {
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.FailedGetConnection, connError);
            }
            const { query, values } = this.buildSPParameters(procedure, parameters);
            const [err, _] = yield await_to_js_1.default(conn.query(query, values));
            if (err) {
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, err);
            }
            return result_1.SuccessResult.GeneralOk();
        });
    }
    ExecuteSQLNoResults(sql, ...parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield getGlobalConnection();
                yield conn.query(sql, parameters);
                return result_1.SuccessResult.GeneralOk();
            }
            catch (error) {
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        });
    }
    ExecuteJsonSQL(sql, ...parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield getGlobalConnection();
                const result = yield conn.query(sql, parameters);
                return result_1.SuccessResult.GeneralOk(JSON.parse(result[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"]));
            }
            catch (error) {
                if (error instanceof SyntaxError &&
                    error.message.indexOf("Unexpected end of JSON input") >= 0) {
                    return result_1.SuccessResult.GeneralOk({});
                }
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        });
    }
    ExecuteJsonListSQL(sql, ...parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield getGlobalConnection();
                const result = yield conn.query(sql, parameters);
                return result_1.SuccessResult.GeneralOk(JSON.parse(result[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"]));
            }
            catch (error) {
                if (error instanceof SyntaxError &&
                    error.message.indexOf("Unexpected end of JSON input") >= 0) {
                    return result_1.SuccessResult.GeneralOk([]);
                }
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        });
    }
    ExecuteTypedJsonSP(resultType, procedure, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.ExecuteSP(resultType, procedure, true, parameters);
        });
    }
    ExecuteJsonSP(procedure, ...parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.ExecuteSP("GENERIC_ACTION", procedure, true, parameters);
        });
    }
    CloseConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield getGlobalConnection();
            conn.close();
        });
    }
    ExecuteSP(resultType, procedure, parseResults, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataRunnerConfiguration = dependency_manager_1.DependencyManager.container.resolve(data_runner_1.DataRunningConfiguration);
            const runner = yield this.CreateQueryRunner();
            try {
                const { query, values } = this.buildSPParameters(procedure, parameters);
                const result = yield runner.manager.query(query, values);
                let data = null;
                if (util_1.isArray(result)) {
                    data = result[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                }
                if (dataRunnerConfiguration.shouldCommit && runner.isTransactionActive) {
                    yield runner.commitTransaction();
                }
                return parseResults
                    ? result_1.SuccessResult.Ok(resultType, JSON.parse(data))
                    : result_1.SuccessResult.Ok(data);
            }
            catch (error) {
                if (error instanceof SyntaxError &&
                    error.message.indexOf("Unexpected end of JSON input") >= 0) {
                    if (dataRunnerConfiguration.shouldCommit &&
                        runner.isTransactionActive) {
                        yield runner.commitTransaction();
                    }
                    return result_1.SuccessResult.Ok(resultType, new Array());
                }
                if (dataRunnerConfiguration.shouldCommit &&
                    runner.isTransactionActive) {
                    yield runner.rollbackTransaction();
                }
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        });
    }
    buildSPParameters(procedure, parameters) {
        const values = [];
        let query = `exec ${procedure} `;
        if (parameters != null) {
            query += parameters
                .map((p, i) => {
                return `@${Object.keys(p)[0]} = @${i}`;
            })
                .join(", ");
            parameters.map((p) => p[Object.keys(p)[0]]).forEach((p) => values.push(p));
        }
        return { query, values };
    }
};
DatabaseManager = __decorate([
    inversify_1.injectable()
], DatabaseManager);
exports.DatabaseManager = DatabaseManager;
//# sourceMappingURL=database-manager.js.map