"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-var-requires
require("dotenv").load();
require("mocha");
const incidents_service_1 = require("../../services/incidents-service");
const incidents_controller_1 = require("../../controllers/incidents-controller");
const chai_1 = require("chai");
const IncidentType_1 = require("../../entity/IncidentType");
const configurations_services_1 = require("../../services/configurations-services");
const database_manager_1 = require("../../services/managers/database-manager");
const GF = require("../factories/general-factory");
const IF = require("../factories/incident-factory");
describe("Incidents Tests", () => __awaiter(void 0, void 0, void 0, function* () {
    this.timeout(15000000);
    const dbm = new database_manager_1.DatabaseManager();
    let runner;
    let IS;
    let ITR;
    let controller;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        runner = yield dbm.CreateQueryRunner();
        IS = new incidents_service_1.IncidentsService();
        ITR = yield runner.manager.getRepository(IncidentType_1.IncidentType);
        controller = new incidents_controller_1.IncidentsController();
        yield runner.startTransaction();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield dbm.RollbackTransaction(runner);
    }));
    describe("Incidents Controller Tests", () => __awaiter(void 0, void 0, void 0, function* () {
        it("should close incident", () => __awaiter(void 0, void 0, void 0, function* () {
            const incident = yield IF.create(runner, yield ITR.findOne(configurations_services_1.Constants.IncidentTypeOwnership));
            const registering = yield IS.create_people_incidents({
                incident,
                people: [(yield GF.create_person(runner))],
                responsible: (yield GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: incidents_service_1.AddToOwnership.DoNotAddToOwnership
            });
            chai_1.expect(registering.success, registering.data ?
                registering.data.message : "").to.be.true("Incident should be registered");
            const closing = yield controller.close_incident(registering.data[0], (yield GF.create_user(runner)));
            chai_1.expect(closing.success, closing.message)
                .to.be.true("Incident should be closed");
        }));
    }));
}));
//# sourceMappingURL=incidents-controller-tests.js.map