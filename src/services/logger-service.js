"use strict";
// tslint:disable:no-console
Object.defineProperty(exports, "__esModule", { value: true });
const errors_codes_1 = require("../helpers/errors-codes");
const azure_tables_manager_1 = require("./managers/azure-tables-manager");
const LOG_TABLE = "ServerLogs";
const ERROR_TABLE = "Errors";
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Info"] = 0] = "Info";
    LogLevel[LogLevel["Error"] = 1] = "Error";
    LogLevel[LogLevel["Benchmark"] = 2] = "Benchmark";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
var LogOrigins;
(function (LogOrigins) {
    LogOrigins[LogOrigins["General"] = 0] = "General";
    LogOrigins[LogOrigins["Debug"] = 1] = "Debug";
    LogOrigins[LogOrigins["ExternalResource"] = 2] = "ExternalResource";
})(LogOrigins = exports.LogOrigins || (exports.LogOrigins = {}));
class LoggerService {
    static error(origin, error, details) {
        const obj = error;
        if (details) {
            obj.details = details;
        }
        this.log(obj, origin, LogLevel.Error);
    }
    static info(origin, details) {
        console.log(origin, details);
        this.log(details, origin, LogLevel.Info);
    }
    static benchmark(operationKey, details) {
        this.log(details, LogOrigins.General, LogLevel.Benchmark, operationKey);
    }
    static log(obj, origin, level = LogLevel.Info, customKey) {
        const tbl = (level === LogLevel.Info || level === LogLevel.Benchmark) ?
            LOG_TABLE : ERROR_TABLE;
        const partition = (level === LogLevel.Info || level === LogLevel.Benchmark) ?
            LogLevel[level] : errors_codes_1.ErrorCode[origin];
        const entity = azure_tables_manager_1.AzureTableManager.buildEntity(customKey || new Date().getTime().toString(), obj, partition);
        if (process.env.PRODUCTION !== "false") {
            azure_tables_manager_1.AzureTableManager.insertOrMergeEntity(this.get_table_service(), tbl, entity, (err) => {
                if (err) {
                    console.log(err);
                    console.log("AzureSessionStore.set: " + err);
                }
            });
        }
        else {
            console.log(entity);
        }
    }
    static get_table_service() {
        if (this.tableService == null) {
            const tableSvc = azure_tables_manager_1.AzureTableManager.createTableService();
            this.tableService = tableSvc;
        }
        return this.tableService;
    }
}
exports.LoggerService = LoggerService;
//# sourceMappingURL=logger-service.js.map