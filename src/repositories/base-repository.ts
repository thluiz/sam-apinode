import { DatabaseManager } from "../services/managers/database-manager";
import { DependencyManager } from "../services/managers/dependency-manager";

import { Repository, SelectQueryBuilder } from "typeorm";
import { tryLogAsync } from "../decorators/trylog-decorator";

export class BaseRepository<T> {
    protected type;
    protected DBM = DependencyManager.container.resolve(DatabaseManager);
    private internalRepository: Repository<T>;

    constructor(type) {
        this.type = type;
    }

    @tryLogAsync()
    async getRepository(): Promise<Repository<T>> {
        if (!this.internalRepository) {
            this.internalRepository = await this.DBM.getRepository<T>(this.type);
        }

        return this.internalRepository;
    }

    @tryLogAsync()
    async createQueryBuilder(): Promise<SelectQueryBuilder<T>> {
        const repo = await this.getRepository();
        return repo.createQueryBuilder();
    }
}
