// tslint:disable-next-line:no-var-requires
require("dotenv").load();

import { expect } from "chai";
import "mocha";
import { QueryRunner, Repository } from "typeorm";

import { ErrorResult, SuccessResult } from "../../helpers/result";
import { AddToOwnership, IncidentErrors,
    IncidentsService, IOwnershipWithSupport } from "../../services/incidents-service";
import { DatabaseManager } from "../../services/managers/database-manager";

import { Incident } from "../../entity/Incident";
import { IncidentType } from "../../entity/IncidentType";

import { IncidentsRepository } from "../../repositories/incidents-repository";
import { Constants } from "../../services/configurations-services";

import * as GF from "../factories/general-factory";
import * as IF from "../factories/incident-factory";

import { DependencyManager } from "../../services/managers/dependency-manager";

describe("Incidents Tests", async () => {
    this.timeout(15000000);
    const dbm = DependencyManager.container.resolve(DatabaseManager);
    let runner: QueryRunner;
    let IS: IncidentsService = new IncidentsService();
    let ITR: Repository<IncidentType>;

    beforeEach(async () => {
        runner = await dbm.CreateQueryRunner();
        ITR = await runner.manager.getRepository<IncidentType>(IncidentType);

        await runner.startTransaction();
    });

    afterEach(async () => {
        await dbm.RollbackTransaction(runner);
    });

    describe("Create Incidents Tests", async () => {

        it("should create incident", async () => {
            const incident = await IF.create(runner, await ITR.findOne(1));
            const registering = await IS.create_people_incidents({
                incident,
                people: [(await GF.create_person(runner))],
                responsible: (await GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: AddToOwnership.DoNotAddToOwnership,
            });

            expect(registering.success, registering.data ?
                (registering.data as Error).message : "")
                .to.be.true("Incident should be registered!");
        });

        it("should create incident with people", async () => {
            const incident = await IF.create(runner, await ITR.findOne(1));
            const registering = await IS.create_people_incidents({
                incident,
                people: [(await GF.create_person(runner))],
                responsible: (await GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: AddToOwnership.DoNotAddToOwnership,
            });

            expect(registering.success, registering.data ?
                (registering.data as Error).message : "")
                .to.be.true("incident should be created!");

            expect(registering.data[0].people_incidents.length).to.be.eq(1);
        });

        it("should create incident in existing ownership", async () => {
            const typeOwnership = await ITR.findOne(Constants.IncidentTypeOwnership);
            const ownershipData = await IF.create(runner, typeOwnership);

            const ownershipRegister = await IS.create_ownership({
                incident: ownershipData,
                responsible: (await GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                new_owner: await GF.create_person(runner),
                new_support: await GF.create_person(runner)
            });

            expect(ownershipRegister.success, ownershipRegister.message)
            .to.be.true("ownership should be registered!");

            const ownershipAndSupport = ownershipRegister.data as IOwnershipWithSupport;
            expect(ownershipAndSupport.ownership.id).to.be.greaterThan(0);

            const typeRequiringOwnership = await ITR.findOne({ require_ownership: true });
            const incident = await IF.create(runner, typeRequiringOwnership);
            const people = [(await GF.create_person(runner)), (await GF.create_person(runner))];

            const registering = await IS.create_people_incidents({
                incident,
                people,
                responsible: (await GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                ownership: ownershipAndSupport.ownership,
                addToOwnership: AddToOwnership.AddToExistingOwnership,
            });

            expect(registering.success, registering.message).
            to.be.true("incidents should be created!");
            expect(registering.data[0].ownership.id).to.be.eq(ownershipAndSupport.ownership.id);
            expect(registering.data[1].ownership.id).to.be.eq(ownershipAndSupport.ownership.id);
        });

        it("should create one incident for each participant", async () => {
            const incident = await IF.create(runner, await ITR.findOne(1));
            const people = [(await GF.create_person(runner)), (await GF.create_person(runner))];
            const registering = await IS.create_people_incidents({
                incident,
                people,
                responsible: (await GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: AddToOwnership.DoNotAddToOwnership,
            });

            expect(registering.success, registering.data ?
                (registering.data as Error).message : "")
                .to.be.true("incidents should be created!");

            expect((registering.data as Incident[]).length).to.be.eq(people.length);
        });

        it("should create incident with new ownership", async () => {
            const typeRequiringOwnership = await ITR.findOne({ require_ownership: true });
            const incident = await IF.create(runner, typeRequiringOwnership);
            const people = [(await GF.create_person(runner)), (await GF.create_person(runner))];

            const registering = await IS.create_people_incidents({
                incident,
                people,
                responsible: (await GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                new_owner: (await GF.create_person(runner)),
                new_support: (await GF.create_person(runner)),
                addToOwnership: AddToOwnership.AddToNewOwnership,
            }) as SuccessResult<Incident[]>;

            expect(registering.success, registering.message)
            .to.be.true("incidents should be created");

            const ownership = registering.data.find((i) => i.type.id === Constants.IncidentTypeOwnership);
            const support = registering.data.find((i) => i.type.id === Constants.IncidentTypeSupport);
            const incidents = registering.data.filter((i) => i.type.id !== Constants.IncidentTypeOwnership
                && i.type.id !== Constants.IncidentTypeSupport);

            expect(ownership.id).to.be.greaterThan(0);
            expect(support.id).to.be.greaterThan(0);
            expect(incidents.length)
                .to.be.equals(people.length,
                    "should return one incident for each participant");

            expect(incidents.length + 2)
                .to.be.equals(registering.data.length,
                    "should return one incident for each person and one ownership and one support");

            expect(incidents.filter((i) => i.ownership.id === ownership.id).length)
                .to.be.equals(incidents.length,
                    "should return all incidents with the same ownership");
        });

        it("should not create incident without title if type require it", async () => {
            const typeRequiringTitle = await ITR.findOne({ require_title: true });
            const incident = await IF.create(runner, typeRequiringTitle);
            incident.title = "";

            const registering = await IS.create_people_incidents({
                incident,
                people: [(await GF.create_person(runner))],
                responsible: (await GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: AddToOwnership.DoNotAddToOwnership,
            }) as ErrorResult;

            expect(registering.success)
            .to.be.false("incidents should not be created!");

            expect(registering.data.message)
            .to.be.eq(IncidentErrors[IncidentErrors.TitleNeeded]);
        });

        it("should not create incident without ownership if type require it", async () => {
            const typeRequiringOwnership = await ITR.findOne({ require_ownership: true });
            const incident = await IF.create(runner, typeRequiringOwnership);

            const registering = await IS.create_people_incidents({
                incident,
                people: [(await GF.create_person(runner))],
                responsible: (await GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: AddToOwnership.DoNotAddToOwnership,
            }) as ErrorResult;

            expect(registering.success)
            .to.be.false("incidents should not be created");
            expect(registering.data.message).to.be.eq(IncidentErrors[IncidentErrors.MissingOwnership]);
        });

        it("should not create incident without ownership if type require it and new support has not been sent",
        async () => {
            const typeRequiringOwnership = await ITR.findOne({ require_ownership: true });
            const incident = await IF.create(runner, typeRequiringOwnership);

            const registering = await IS.create_people_incidents({
                incident,
                people: [(await GF.create_person(runner))],
                responsible: (await GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                new_owner: (await GF.create_person(runner)),
                addToOwnership: AddToOwnership.AddToNewOwnership,
            }) as ErrorResult;

            expect(registering.success)
            .to.be.false("incidents should not be created!");

            expect(registering.data.message)
                .to.be.eq(IncidentErrors[IncidentErrors.MissingOwnerOrSupport]);
        });

        it("should not create incident without ownership if type require it and new owner has not been sent",
        async () => {
            const typeRequiringOwnership = await ITR.findOne({ require_ownership: true });
            const incident = await IF.create(runner, typeRequiringOwnership);

            const registering = await IS.create_people_incidents({
                incident,
                people: [(await GF.create_person(runner))],
                responsible: (await GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: AddToOwnership.AddToNewOwnership,
            }) as ErrorResult;

            expect(registering.success)
            .to.be.false("incidents should not be created!");

            expect(registering.data.message)
            .to.be.eq(IncidentErrors[IncidentErrors.MissingOwnerOrSupport]);
        });

        it("should not create incident without ownership if type require it and new owner has not been sent",
        async () => {
            const typeRequiringOwnership = await ITR.findOne({ require_ownership: true });
            const incident = await IF.create(runner, typeRequiringOwnership);

            const registering = await IS.create_people_incidents({
                incident,
                people: [(await GF.create_person(runner))],
                responsible: (await GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: AddToOwnership.AddToExistingOwnership,
            }) as ErrorResult;

            expect(registering.success)
            .to.be.false("Incident should not be created!");
            expect(registering.data.message).to.be.eq(IncidentErrors[IncidentErrors.MissingOwnership]);
        });

        it("should not create incident with new ownership sending as to add to existing ownership",
        async () => {
            const typeRequiringOwnership = await ITR.findOne({ require_ownership: true });
            const incident = await IF.create(runner, typeRequiringOwnership);
            const people = [(await GF.create_person(runner)), (await GF.create_person(runner))];

            const registering = await IS.create_people_incidents({
                incident,
                people,
                responsible: (await GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                new_owner: people[0],
                new_support: people[1],
                addToOwnership: AddToOwnership.AddToExistingOwnership,
            }) as ErrorResult;

            expect(registering.success).to.be.false("incidents should not be created!");
            expect(registering.data.message).to.be.eq(IncidentErrors[IncidentErrors.MissingOwnership]);
        });

        it("should not create incident without value if type require it", async () => {
            const typeRequiringValue = await ITR.findOne({ need_value: true });
            const incident = await IF.create(runner, typeRequiringValue);
            incident.value = 0;

            const registering = await IS.create_people_incidents({
                incident,
                people: [(await GF.create_person(runner))],
                responsible: (await GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: AddToOwnership.DoNotAddToOwnership,
            }) as ErrorResult;

            expect(registering.success)
            .to.be.false("incidents should not be created!");
            expect(registering.data.message).to.be.eq(IncidentErrors[IncidentErrors.ValueNeeded]);
        });
    });

    describe("Close Incidents Tests", async () => {
        it("should close incident", async () => {
            const incidentData = await IF.create(runner, await ITR.findOne(1));
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
            to.be.true("incidents close result should be true");

            const IR = await new IncidentsRepository().getRepository();
            const incident = (await IR.findOne((registering.data as Incident).id));

            expect(incident.closed).
            to.be.true("incident should be closed");
        });

        it("should close ownership", async () => {
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
            to.be.true("incidents close result should be true");

            const IR = await new IncidentsRepository().getRepository();
            const incident = (await IR.findOne((registering.data as Incident).id));

            expect(incident.closed).
            to.be.true("ownership should be closed");
        });
    });
});
