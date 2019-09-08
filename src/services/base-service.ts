import { EntitySchema, QueryRunner } from "typeorm";

import { DatabaseManager } from "./managers/database-manager";
import { DependencyManager } from "./managers/dependency-manager";

export class BaseService {
    get databaseManager(): DatabaseManager {
        return DependencyManager.container.resolve(DatabaseManager);
    }

    get queryRunner(): Promise<QueryRunner> {
        return new Promise((resolve) => {
            this.databaseManager
            .CreateQueryRunner()
            .then((queryRunner) => {
                resolve(queryRunner);
            });
        });
    }

    async getRepository<T>(type: string | (new () => any) | EntitySchema<T>) {
        return (await this.queryRunner).manager.getRepository(type);
    }

    async save<T>(entity: T) {
        return (await this.queryRunner).manager.save(entity);
    }
    async create<T>(entityClass: string  | (new () => any) | EntitySchema<T>, object: any) {
        const manager = (await this.queryRunner).manager;

        return manager.create(entityClass, object);
    }
}
