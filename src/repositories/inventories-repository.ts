import { tryLogAsync } from "../decorators/trylog-decorator";

import { Result, SuccessResult } from "../helpers/result";

import { BaseRepository } from "./base-repository";

import { InventoryItem } from "../entity/InventoryItem";

export class InventoriesRepository extends BaseRepository<InventoryItem> {
    constructor() {
        super(InventoryItem);
    }

    @tryLogAsync()
    async getAll(): Promise<Result<InventoryItem[]>> {
        const query = (await this.createQueryBuilder());
        const result = await query.getMany();

        return SuccessResult.GeneralOk(result);
    }
}
