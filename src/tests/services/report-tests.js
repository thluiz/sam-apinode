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
const chai_1 = require("chai");
require("mocha");
const incidents_service_1 = require("../../services/incidents-service");
const ownership_closing_report_1 = require("../../services/reports/ownership-closing-report");
const GF = require("../factories/general-factory");
const IF = require("../factories/incident-factory");
const IncidentType_1 = require("../../entity/IncidentType");
const incidents_repository_1 = require("../../repositories/incidents-repository");
const configurations_services_1 = require("../../services/configurations-services");
const database_manager_1 = require("../../services/managers/database-manager");
describe("Reporting Tests", () => __awaiter(void 0, void 0, void 0, function* () {
    this.timeout(15000000);
    let runner;
    let IS;
    let ITR;
    const dbm = new database_manager_1.DatabaseManager();
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        runner = yield dbm.CreateQueryRunner();
        IS = new incidents_service_1.IncidentsService();
        ITR = yield runner.manager.getRepository(IncidentType_1.IncidentType);
        yield runner.startTransaction();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield dbm.RollbackTransaction(runner);
    }));
    it("should send ownership report", () => __awaiter(void 0, void 0, void 0, function* () {
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
            to.be.true("incident should be closed");
        const IR = yield new incidents_repository_1.IncidentsRepository().getRepository();
        const incident = (yield IR.findOne(registering.data.id));
        const result = yield new ownership_closing_report_1.OwnershipClosingReport().send(incident);
        chai_1.expect(result.success)
            .to.be.true("closing report should be created");
    }));
}));
//# sourceMappingURL=report-tests.js.map