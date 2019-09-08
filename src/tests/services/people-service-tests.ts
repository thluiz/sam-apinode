// tslint:disable-next-line:no-var-requires
require("dotenv").load();

import { expect } from "chai";
import "mocha";
import { QueryRunner } from "typeorm";

import { Person } from "../../entity/Person";
import { DatabaseManager } from "../../services/managers/database-manager";
import { PeopleService } from "../../services/people-service";

describe("People Tests", async function() {
    this.timeout(15000000);
    const dbm = new DatabaseManager();
    let runner: QueryRunner;
    let PS: PeopleService;

    beforeEach(async () => {
        runner = await dbm.CreateQueryRunner();
        PS = new PeopleService();
        await dbm.StartTransaction(runner);
    });

    afterEach(async() => {
        await dbm.RollbackTransaction(runner);
    });

    it("should create person", async () => {
        const result = await PS.create_person("TESTE person name", 4);

        expect(result.success);
        expect((result.data as Person).id).to.be.greaterThan(0);
    });

    it("should create interested", async () => {
        const result = await PS.create_person("TESTE person name", 4);
        expect(result.success);
        expect((result.data as Person).is_interested).
        to.be.true("person should be interested");
    });
});
