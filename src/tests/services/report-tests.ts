// tslint:disable-next-line:no-var-requires
require("dotenv").load();

import { expect } from "chai";
import "mocha";
import { QueryRunner, Repository } from "typeorm";

import { IncidentsService } from "../../services/incidents-service";

import { OwnershipClosingReport } from "../../services/reports/ownership-closing-report";

import * as GF from "../factories/general-factory";
import * as IF from "../factories/incident-factory";

import { Incident } from "../../entity/Incident";
import { IncidentType } from "../../entity/IncidentType";

import { IncidentsRepository } from "../../repositories/incidents-repository";
import { Constants } from "../../services/configurations-services";
import { DatabaseManager } from "../../services/managers/database-manager";

describe("Reporting Tests", async () => {
    this.timeout(15000000);
    let runner: QueryRunner;
    let IS: IncidentsService;
    let ITR: Repository<IncidentType>;
    const dbm = new DatabaseManager();

    beforeEach(async () => {
        runner = await dbm.CreateQueryRunner();
        IS = new IncidentsService();
        ITR = await runner.manager.getRepository<IncidentType>(IncidentType);

        await runner.startTransaction();
    });

    afterEach(async () => {
        await dbm.RollbackTransaction(runner);
    });

    it("should send ownership report", async () => {
        const incidentData = await IF.create(runner,
            await ITR.findOne(Constants.IncidentTypeOwnership)
        );

        const registering = await IS.create_incident_for_person({
            incident: incidentData,
            person: (await GF.create_person(runner)),
            responsible: (await GF.create_responsible(runner)),
            register_closed: false,
            register_treated: false,
            start_activity: false
        });

        const closingResult = await IS.close_incident(
            registering.data as Incident,
            await GF.create_responsible(runner)
        );

        expect(closingResult.success, closingResult.message).
        to.be.true("incident should be closed");

        const IR = await new IncidentsRepository().getRepository();
        const incident = (await IR.findOne((registering.data as Incident).id));

        const result = await new OwnershipClosingReport().send(incident);
        expect(result.success)
        .to.be.true("closing report should be created");
    });
});
