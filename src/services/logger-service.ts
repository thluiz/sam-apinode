// tslint:disable:no-console

import { ErrorCode } from "../helpers/errors-codes";
import { AzureTableManager } from "./managers/azure-tables-manager";

const LOG_TABLE = "ServerLogs";
const ERROR_TABLE = "Errors";

export enum LogLevel {
    Info,
    Error,
    Benchmark
}

export enum LogOrigins {
    General,
    Debug,
    ExternalResource
}

export class LoggerService {

    static error(origin: ErrorCode, error: Error, details?: any) {
        const obj = error as any;

        if (details) {
            obj.details = details;
        }

        this.log(obj, origin, LogLevel.Error);
    }

    static info(origin: LogOrigins, details?: any) {
        console.log(origin, details);
        this.log(details, origin, LogLevel.Info);
    }

    static benchmark(operationKey: string, details?: any) {
        this.log(details, LogOrigins.General, LogLevel.Benchmark, operationKey);
    }

    static log(obj, origin: ErrorCode | LogOrigins,
               level: LogLevel | string = LogLevel.Info,
               customKey?: number | string) {

        const tbl = (level === LogLevel.Info || level === LogLevel.Benchmark) ?
                        LOG_TABLE : ERROR_TABLE;
        const partition = (level === LogLevel.Info || level === LogLevel.Benchmark) ?
                        LogLevel[level] : ErrorCode[origin];

        const entity = AzureTableManager.buildEntity(
            customKey || new Date().getTime().toString(),
            obj, partition);

        if (process.env.PRODUCTION !== "false") {
            AzureTableManager.insertOrMergeEntity(
                this.get_table_service(), tbl,
                entity, (err) => {
                if (err) {
                    console.log(err);
                    console.log("AzureSessionStore.set: " + err);
                }
            });
        } else {
            console.log(entity);
        }
    }

    private static tableService;

    private static get_table_service() {
        if (this.tableService == null) {
            const tableSvc = AzureTableManager.createTableService();

            this.tableService = tableSvc;
        }

        return this.tableService;
    }
}
