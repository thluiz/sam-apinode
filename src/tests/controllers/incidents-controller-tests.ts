// tslint:disable-next-line:no-var-requires
require("dotenv").load();

import "mocha";
import { QueryRunner, Repository } from "typeorm";

import { AddToOwnership, IncidentsService } from "../../services/incidents-service";

import { IncidentsController } from "../../controllers/incidents-controller";

import { expect } from "chai";
import { IncidentType } from "../../entity/IncidentType";
import { Constants } from "../../services/configurations-services";
import { DatabaseManager } from "../../services/managers/database-manager";

import * as GF from "../factories/general-factory";
import * as IF from "../factories/incident-factory";

describe("Incidents Tests", async () => {
    this.timeout(15000000);
    const dbm = new DatabaseManager();
    let runner: QueryRunner;
    let IS: IncidentsService;
    let ITR: Repository<IncidentType>;
    let controller: IncidentsController;

    beforeEach(async () => {
        runner = await dbm.CreateQueryRunner();
        IS = new IncidentsService();
        ITR = await runner.manager.getRepository<IncidentType>(IncidentType);
        controller = new IncidentsController();
        await runner.startTransaction();
    });

    afterEach(async () => {
        await dbm.RollbackTransaction(runner);
    });

    describe("Incidents Controller Tests", async () => {

        it("should close incident", async () => {
            const incident = await IF.create(runner, await ITR.findOne(Constants.IncidentTypeOwnership));
            const registering = await IS.create_people_incidents({
                incident,
                people: [(await GF.create_person(runner))],
                responsible: (await GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: AddToOwnership.DoNotAddToOwnership
            });

            expect(registering.success, registering.data ?
                (registering.data as Error).message : ""
            ).to.be.true("Incident should be registered");

            const closing = await controller.close_incident(
                registering.data[0],
                (await GF.create_user(runner))
            );

            expect(closing.success, closing.message)
            .to.be.true("Incident should be closed");
        });
    });
});
