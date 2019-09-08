// tslint:disable-next-line:no-var-requires
require("dotenv").load();

import { expect } from "chai";
import "mocha";
import { QueryRunner, Repository } from "typeorm";

import { User } from "../../entity/User";
import { IncidentsService } from "../../services/incidents-service";
import { DatabaseManager } from "../../services/managers/database-manager";

describe("Security Tests", async () => {
    this.timeout(15000000);
    let runner: QueryRunner;
    let IS: IncidentsService;
    let UR: Repository<User>;
    const dbm = new DatabaseManager();

    beforeEach(async () => {
        runner = await dbm.CreateQueryRunner();
        IS = new IncidentsService();
        UR = await runner.manager.getRepository<User>(User);

        await runner.startTransaction();
    });

    afterEach(async () => {
        await dbm.RollbackTransaction(runner);
    });

    it("should load person from user", async () => {
        const user = await UR.findOne(4);
        const person = await user.getPerson();

        expect(person.id).to.be.greaterThan(0);
    });
});
