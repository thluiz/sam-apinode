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
const User_1 = require("../../entity/User");
const incidents_service_1 = require("../../services/incidents-service");
const database_manager_1 = require("../../services/managers/database-manager");
describe("Security Tests", () => __awaiter(void 0, void 0, void 0, function* () {
    this.timeout(15000000);
    let runner;
    let IS;
    let UR;
    const dbm = new database_manager_1.DatabaseManager();
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        runner = yield dbm.CreateQueryRunner();
        IS = new incidents_service_1.IncidentsService();
        UR = yield runner.manager.getRepository(User_1.User);
        yield runner.startTransaction();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield dbm.RollbackTransaction(runner);
    }));
    it("should load person from user", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield UR.findOne(4);
        const person = yield user.getPerson();
        chai_1.expect(person.id).to.be.greaterThan(0);
    }));
}));
//# sourceMappingURL=security-tests.js.map