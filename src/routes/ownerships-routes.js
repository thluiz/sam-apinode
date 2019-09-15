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
const auth = require("../middlewares/auth");
const incidents_repository_1 = require("../repositories/incidents-repository");
const incidents_service_1 = require("../services/incidents-service");
function routes(app) {
    const IS = new incidents_service_1.IncidentsService();
    const IR = new incidents_repository_1.IncidentsRepository();
    app.get("/api/ownerships_converage/:id", auth.ensureLoggedIn(), (req, response) => __awaiter(this, void 0, void 0, function* () {
        const result = yield IR.getOwnershipDataForCoverage(req.params.id);
        response.send(result);
    }));
    app.get("/api/ownership_schedules/:id/:showPast?", auth.ensureLoggedIn(), (req, response) => __awaiter(this, void 0, void 0, function* () {
        const result = yield IR.getOwnershipsFromSchedule(req.params.id, req.params.showPast == "1");
        response.send(result);
    }));
    app.post("/api/ownerships/schedule", auth.ensureLoggedIn(), (req, response) => __awaiter(this, void 0, void 0, function* () {
        const result = yield IS.scheduleOwnership(req.body.ownership);
        response.send(result);
    }));
    app.post("/api/ownerships/migrate", auth.ensureLoggedIn(), (req, response) => __awaiter(this, void 0, void 0, function* () {
        const result = yield IS.migrateOwnership(req.body.ownership, req.body.incidents);
        response.send(result);
    }));
}
exports.routes = routes;
//# sourceMappingURL=ownerships-routes.js.map