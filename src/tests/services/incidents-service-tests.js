"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-var-requires
require("dotenv").load();
const chai_1 = require("chai");
require("mocha");
const incidents_service_1 = require("../../services/incidents-service");
const database_manager_1 = require("../../services/managers/database-manager");
const IncidentType_1 = require("../../entity/IncidentType");
const incidents_repository_1 = require("../../repositories/incidents-repository");
const configurations_services_1 = require("../../services/configurations-services");
const GF = require("../factories/general-factory");
const IF = require("../factories/incident-factory");
const dependency_manager_1 = require("../../services/managers/dependency-manager");
describe("Incidents Tests", () => __awaiter(this, void 0, void 0, function* () {
    this.timeout(15000000);
    const dbm = dependency_manager_1.DependencyManager.container.resolve(database_manager_1.DatabaseManager);
    let runner;
    let IS = new incidents_service_1.IncidentsService();
    let ITR;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        runner = yield dbm.CreateQueryRunner();
        ITR = yield runner.manager.getRepository(IncidentType_1.IncidentType);
        yield runner.startTransaction();
    }));
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        yield dbm.RollbackTransaction(runner);
    }));
    describe("Create Incidents Tests", () => __awaiter(this, void 0, void 0, function* () {
        it("should create incident", () => __awaiter(this, void 0, void 0, function* () {
            const incident = yield IF.create(runner, yield ITR.findOne(1));
            const registering = yield IS.create_people_incidents({
                incident,
                people: [(yield GF.create_person(runner))],
                responsible: (yield GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: incidents_service_1.AddToOwnership.DoNotAddToOwnership,
            });
            chai_1.expect(registering.success, registering.data ?
                registering.data.message : "")
                .to.be.true("Incident should be registered!");
        }));
        it("should create incident with people", () => __awaiter(this, void 0, void 0, function* () {
            const incident = yield IF.create(runner, yield ITR.findOne(1));
            const registering = yield IS.create_people_incidents({
                incident,
                people: [(yield GF.create_person(runner))],
                responsible: (yield GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: incidents_service_1.AddToOwnership.DoNotAddToOwnership,
            });
            chai_1.expect(registering.success, registering.data ?
                registering.data.message : "")
                .to.be.true("incident should be created!");
            chai_1.expect(registering.data[0].people_incidents.length).to.be.eq(1);
        }));
        it("should create incident in existing ownership", () => __awaiter(this, void 0, void 0, function* () {
            const typeOwnership = yield ITR.findOne(configurations_services_1.Constants.IncidentTypeOwnership);
            const ownershipData = yield IF.create(runner, typeOwnership);
            const ownershipRegister = yield IS.create_ownership({
                incident: ownershipData,
                responsible: (yield GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                new_owner: yield GF.create_person(runner),
                new_support: yield GF.create_person(runner)
            });
            chai_1.expect(ownershipRegister.success, ownershipRegister.message)
                .to.be.true("ownership should be registered!");
            const ownershipAndSupport = ownershipRegister.data;
            chai_1.expect(ownershipAndSupport.ownership.id).to.be.greaterThan(0);
            const typeRequiringOwnership = yield ITR.findOne({ require_ownership: true });
            const incident = yield IF.create(runner, typeRequiringOwnership);
            const people = [(yield GF.create_person(runner)), (yield GF.create_person(runner))];
            const registering = yield IS.create_people_incidents({
                incident,
                people,
                responsible: (yield GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                ownership: ownershipAndSupport.ownership,
                addToOwnership: incidents_service_1.AddToOwnership.AddToExistingOwnership,
            });
            chai_1.expect(registering.success, registering.message).
                to.be.true("incidents should be created!");
            chai_1.expect(registering.data[0].ownership.id).to.be.eq(ownershipAndSupport.ownership.id);
            chai_1.expect(registering.data[1].ownership.id).to.be.eq(ownershipAndSupport.ownership.id);
        }));
        it("should create one incident for each participant", () => __awaiter(this, void 0, void 0, function* () {
            const incident = yield IF.create(runner, yield ITR.findOne(1));
            const people = [(yield GF.create_person(runner)), (yield GF.create_person(runner))];
            const registering = yield IS.create_people_incidents({
                incident,
                people,
                responsible: (yield GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: incidents_service_1.AddToOwnership.DoNotAddToOwnership,
            });
            chai_1.expect(registering.success, registering.data ?
                registering.data.message : "")
                .to.be.true("incidents should be created!");
            chai_1.expect(registering.data.length).to.be.eq(people.length);
        }));
        it("should create incident with new ownership", () => __awaiter(this, void 0, void 0, function* () {
            const typeRequiringOwnership = yield ITR.findOne({ require_ownership: true });
            const incident = yield IF.create(runner, typeRequiringOwnership);
            const people = [(yield GF.create_person(runner)), (yield GF.create_person(runner))];
            const registering = yield IS.create_people_incidents({
                incident,
                people,
                responsible: (yield GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                new_owner: (yield GF.create_person(runner)),
                new_support: (yield GF.create_person(runner)),
                addToOwnership: incidents_service_1.AddToOwnership.AddToNewOwnership,
            });
            chai_1.expect(registering.success, registering.message)
                .to.be.true("incidents should be created");
            const ownership = registering.data.find((i) => i.type.id === configurations_services_1.Constants.IncidentTypeOwnership);
            const support = registering.data.find((i) => i.type.id === configurations_services_1.Constants.IncidentTypeSupport);
            const incidents = registering.data.filter((i) => i.type.id !== configurations_services_1.Constants.IncidentTypeOwnership
                && i.type.id !== configurations_services_1.Constants.IncidentTypeSupport);
            chai_1.expect(ownership.id).to.be.greaterThan(0);
            chai_1.expect(support.id).to.be.greaterThan(0);
            chai_1.expect(incidents.length)
                .to.be.equals(people.length, "should return one incident for each participant");
            chai_1.expect(incidents.length + 2)
                .to.be.equals(registering.data.length, "should return one incident for each person and one ownership and one support");
            chai_1.expect(incidents.filter((i) => i.ownership.id === ownership.id).length)
                .to.be.equals(incidents.length, "should return all incidents with the same ownership");
        }));
        it("should not create incident without title if type require it", () => __awaiter(this, void 0, void 0, function* () {
            const typeRequiringTitle = yield ITR.findOne({ require_title: true });
            const incident = yield IF.create(runner, typeRequiringTitle);
            incident.title = "";
            const registering = yield IS.create_people_incidents({
                incident,
                people: [(yield GF.create_person(runner))],
                responsible: (yield GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: incidents_service_1.AddToOwnership.DoNotAddToOwnership,
            });
            chai_1.expect(registering.success)
                .to.be.false("incidents should not be created!");
            chai_1.expect(registering.data.message)
                .to.be.eq(incidents_service_1.IncidentErrors[incidents_service_1.IncidentErrors.TitleNeeded]);
        }));
        it("should not create incident without ownership if type require it", () => __awaiter(this, void 0, void 0, function* () {
            const typeRequiringOwnership = yield ITR.findOne({ require_ownership: true });
            const incident = yield IF.create(runner, typeRequiringOwnership);
            const registering = yield IS.create_people_incidents({
                incident,
                people: [(yield GF.create_person(runner))],
                responsible: (yield GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: incidents_service_1.AddToOwnership.DoNotAddToOwnership,
            });
            chai_1.expect(registering.success)
                .to.be.false("incidents should not be created");
            chai_1.expect(registering.data.message).to.be.eq(incidents_service_1.IncidentErrors[incidents_service_1.IncidentErrors.MissingOwnership]);
        }));
        it("should not create incident without ownership if type require it and new support has not been sent", () => __awaiter(this, void 0, void 0, function* () {
            const typeRequiringOwnership = yield ITR.findOne({ require_ownership: true });
            const incident = yield IF.create(runner, typeRequiringOwnership);
            const registering = yield IS.create_people_incidents({
                incident,
                people: [(yield GF.create_person(runner))],
                responsible: (yield GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                new_owner: (yield GF.create_person(runner)),
                addToOwnership: incidents_service_1.AddToOwnership.AddToNewOwnership,
            });
            chai_1.expect(registering.success)
                .to.be.false("incidents should not be created!");
            chai_1.expect(registering.data.message)
                .to.be.eq(incidents_service_1.IncidentErrors[incidents_service_1.IncidentErrors.MissingOwnerOrSupport]);
        }));
        it("should not create incident without ownership if type require it and new owner has not been sent", () => __awaiter(this, void 0, void 0, function* () {
            const typeRequiringOwnership = yield ITR.findOne({ require_ownership: true });
            const incident = yield IF.create(runner, typeRequiringOwnership);
            const registering = yield IS.create_people_incidents({
                incident,
                people: [(yield GF.create_person(runner))],
                responsible: (yield GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: incidents_service_1.AddToOwnership.AddToNewOwnership,
            });
            chai_1.expect(registering.success)
                .to.be.false("incidents should not be created!");
            chai_1.expect(registering.data.message)
                .to.be.eq(incidents_service_1.IncidentErrors[incidents_service_1.IncidentErrors.MissingOwnerOrSupport]);
        }));
        it("should not create incident without ownership if type require it and new owner has not been sent", () => __awaiter(this, void 0, void 0, function* () {
            const typeRequiringOwnership = yield ITR.findOne({ require_ownership: true });
            const incident = yield IF.create(runner, typeRequiringOwnership);
            const registering = yield IS.create_people_incidents({
                incident,
                people: [(yield GF.create_person(runner))],
                responsible: (yield GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: incidents_service_1.AddToOwnership.AddToExistingOwnership,
            });
            chai_1.expect(registering.success)
                .to.be.false("Incident should not be created!");
            chai_1.expect(registering.data.message).to.be.eq(incidents_service_1.IncidentErrors[incidents_service_1.IncidentErrors.MissingOwnership]);
        }));
        it("should not create incident with new ownership sending as to add to existing ownership", () => __awaiter(this, void 0, void 0, function* () {
            const typeRequiringOwnership = yield ITR.findOne({ require_ownership: true });
            const incident = yield IF.create(runner, typeRequiringOwnership);
            const people = [(yield GF.create_person(runner)), (yield GF.create_person(runner))];
            const registering = yield IS.create_people_incidents({
                incident,
                people,
                responsible: (yield GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                new_owner: people[0],
                new_support: people[1],
                addToOwnership: incidents_service_1.AddToOwnership.AddToExistingOwnership,
            });
            chai_1.expect(registering.success).to.be.false("incidents should not be created!");
            chai_1.expect(registering.data.message).to.be.eq(incidents_service_1.IncidentErrors[incidents_service_1.IncidentErrors.MissingOwnership]);
        }));
        it("should not create incident without value if type require it", () => __awaiter(this, void 0, void 0, function* () {
            const typeRequiringValue = yield ITR.findOne({ need_value: true });
            const incident = yield IF.create(runner, typeRequiringValue);
            incident.value = 0;
            const registering = yield IS.create_people_incidents({
                incident,
                people: [(yield GF.create_person(runner))],
                responsible: (yield GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: incidents_service_1.AddToOwnership.DoNotAddToOwnership,
            });
            chai_1.expect(registering.success)
                .to.be.false("incidents should not be created!");
            chai_1.expect(registering.data.message).to.be.eq(incidents_service_1.IncidentErrors[incidents_service_1.IncidentErrors.ValueNeeded]);
        }));
    }));
    describe("Close Incidents Tests", () => __awaiter(this, void 0, void 0, function* () {
        it("should close incident", () => __awaiter(this, void 0, void 0, function* () {
            const incidentData = yield IF.create(runner, yield ITR.findOne(1));
            const registering = yield IS.create_incident_for_person({
                incident: incidentData,
                person: (yield GF.create_person(runner)),
                responsible: (yield GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false
            });
            const closingResult = yield IS.close_incident(registering.data, yield GF.create_responsible(runner));
            chai_1.expect(closingResult.success, closingResult.message).
                to.be.true("incidents close result should be true");
            const IR = yield new incidents_repository_1.IncidentsRepository().getRepository();
            const incident = (yield IR.findOne(registering.data.id));
            chai_1.expect(incident.closed).
                to.be.true("incident should be closed");
        }));
        it("should close ownership", () => __awaiter(this, void 0, void 0, function* () {
            const incidentData = yield IF.create(runner, yield ITR.findOne(configurations_services_1.Constants.IncidentTypeOwnership));
            const registering = yield IS.create_incident_for_person({
                incident: incidentData,
                person: (yield GF.create_person(runner)),
                responsible: (yield GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false
            });
            const closingResult = yield IS.close_incident(registering.data, yield GF.create_responsible(runner));
            chai_1.expect(closingResult.success, closingResult.message).
                to.be.true("incidents close result should be true");
            const IR = yield new incidents_repository_1.IncidentsRepository().getRepository();
            const incident = (yield IR.findOne(registering.data.id));
            chai_1.expect(incident.closed).
                to.be.true("ownership should be closed");
        }));
    }));
}));
//# sourceMappingURL=incidents-service-tests.js.map