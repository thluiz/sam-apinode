import { isArray } from 'util';
import to from "await-to-js";
import { injectable } from "inversify";
import "reflect-metadata";
import { Connection, EntitySchema, QueryRunner, Repository } from "typeorm";
import { createConnection } from "typeorm";
import { ErrorCode } from "../../helpers/errors-codes";
import { ErrorResult, Result, SuccessResult } from "../../helpers/result";
import { DataRunningConfiguration } from "./data-runner";
import { DependencyManager } from "./dependency-manager";

let connection: Connection = null;

async function getGlobalConnection(): Promise<Connection> {
    if (!connection) {
        connection = await createConnection({
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
}

@injectable()
export class DatabaseManager {
    async getConnection() {
        return getGlobalConnection();
    }

    async getRepository<T>(
        type: string | (new () => any) | EntitySchema<T>
    ): Promise<Repository<T>> {
        const manager = (await getGlobalConnection()).manager;

        return await manager.getRepository(type);
    }

    async CreateQueryRunner(): Promise<QueryRunner> {
        const conn = await getGlobalConnection();
        const queryRunner = conn.createQueryRunner();

        if (!queryRunner.connection.isConnected) {
            await queryRunner.connection.connect();
        }

        return queryRunner;
    }

    async StartTransaction(queryRunner): Promise<QueryRunner> {
        await queryRunner.startTransaction();

        return queryRunner;
    }

    async CommitTransaction(queryRunner: QueryRunner): Promise<void> {
        queryRunner.commitTransaction();
    }

    async RollbackTransaction(queryRunner: QueryRunner): Promise<void> {
        queryRunner.rollbackTransaction();
    }

    async ExecuteWithinTransaction<T>(
        fun: (queryRunner: QueryRunner) => Promise<Result<T>>,
        queryRunner?: QueryRunner
    ): Promise<Result<T>> {
        if (queryRunner) {
            return fun(queryRunner);
        }

        const conn = await getGlobalConnection();
        queryRunner = conn.createQueryRunner();

        try {
            await queryRunner.startTransaction();

            const result = await fun(queryRunner);

            await queryRunner.commitTransaction();

            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();

            return ErrorResult.Fail(ErrorCode.GenericError, error);
        }
    }

    async ExecuteSPNoResults(
        procedure: string,
        ...parameters: any[]
    ): Promise<Result<void>> {
        const [connError, conn] = await to<Connection>(getGlobalConnection());

        if (connError) {
            return ErrorResult.Fail(ErrorCode.FailedGetConnection, connError);
        }

        const { query, values } = this.buildSPParameters(procedure, parameters);

        const [err, _] = await to(conn.query(query, values));

        if (err) {
            return ErrorResult.Fail(ErrorCode.GenericError, err);
        }

        return SuccessResult.GeneralOk();
    }

    public async ExecuteSQLNoResults(
        sql: string,
        ...parameters: any[]
    ): Promise<Result<void>> {
        try {
            const conn = await getGlobalConnection();

            await conn.query(sql, parameters);

            return SuccessResult.GeneralOk();
        } catch (error) {
            return ErrorResult.Fail(ErrorCode.GenericError, error);
        }
    }

    public async ExecuteJsonSQL<T>(
        sql: string,
        ...parameters: any[]
    ): Promise<Result<T>> {
        try {
            const conn = await getGlobalConnection();

            const result = await conn.query(sql, parameters);

            return SuccessResult.GeneralOk(JSON.parse(
                result[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"]
            ) as T);
        } catch (error) {
            if (
                error instanceof SyntaxError &&
                error.message.indexOf("Unexpected end of JSON input") >= 0
            ) {
                return SuccessResult.GeneralOk({} as T);
            }

            return ErrorResult.Fail(ErrorCode.GenericError, error);
        }
    }

    public async ExecuteJsonListSQL<T>(
        sql: string,
        ...parameters: any[]
    ): Promise<Result<T[]>> {
        try {
            const conn = await getGlobalConnection();

            const result = await conn.query(sql, parameters);

            return SuccessResult.GeneralOk(JSON.parse(
                result[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"]
            ) as T[]);
        } catch (error) {
            if (
                error instanceof SyntaxError &&
                error.message.indexOf("Unexpected end of JSON input") >= 0
            ) {
                return SuccessResult.GeneralOk([] as T[]);
            }

            return ErrorResult.Fail(ErrorCode.GenericError, error);
        }
    }

    async ExecuteTypedJsonSP<T>(
        resultType: string,
        procedure: string,
        parameters?: any[]
    ): Promise<Result<T>> {
        return this.ExecuteSP<T>(resultType, procedure, true, parameters);
    }

    public async ExecuteJsonSP<T>(
        procedure: string,
        ...parameters: any[]
    ): Promise<Result<T>> {
        return await this.ExecuteSP<T>("GENERIC_ACTION", procedure, true, parameters);
    }

    async CloseConnection() {
        const conn = await getGlobalConnection();
        conn.close();
    }

    private async ExecuteSP<T>(
        resultType: string,
        procedure: string,
        parseResults: boolean,
        parameters?: any[]
    ): Promise<Result<T>> {
        const dataRunnerConfiguration = DependencyManager.container.resolve(
            DataRunningConfiguration
        );

        const runner = await this.CreateQueryRunner();

        try {
            const { query, values } = this.buildSPParameters(procedure, parameters);

            const result = await runner.manager.query(query, values);
            let data: any = null;

            if (isArray(result)) {
                data = result[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
            }

            if (dataRunnerConfiguration.shouldCommit && runner.isTransactionActive) {
                await runner.commitTransaction();
            }

            return parseResults
            ? SuccessResult.Ok(resultType, JSON.parse(data))
            : SuccessResult.Ok(data);
        } catch (error) {
            if (
                error instanceof SyntaxError &&
                error.message.indexOf("Unexpected end of JSON input") >= 0
            ) {
                if (
                    dataRunnerConfiguration.shouldCommit &&
                    runner.isTransactionActive
                ) {
                    await runner.commitTransaction();
                }
                return SuccessResult.Ok(resultType, new Array() as any);
            }

            if (
                dataRunnerConfiguration.shouldCommit &&
                runner.isTransactionActive
            ) {
                await runner.rollbackTransaction();
            }

            return ErrorResult.Fail(ErrorCode.GenericError, error);
        }
    }

    private buildSPParameters(
        procedure: string,
        parameters: any[]
    ): { query: string; values: any[] } {
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
}
