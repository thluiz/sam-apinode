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
const incidents_repository_1 = require("../repositories/incidents-repository");
const jobs_service_1 = require("../services/jobs-service");
const ownership_closing_report_1 = require("../services/reports/ownership-closing-report");
function routes(app) {
    app.get("/api/hourly-jobs", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new jobs_service_1.JobsService().execute_hourly_jobs();
        res.send(result);
    }));
    app.get("/api/ownership_report", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const IR = yield new incidents_repository_1.IncidentsRepository().getRepository();
        const incident = yield IR.findOne(176372);
        const result = yield new ownership_closing_report_1.OwnershipClosingReport().send(incident);
        res.send(result.success ? result.data.content : result);
    }));
    app.get("/api/json_ownership_report", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const IR = yield new incidents_repository_1.IncidentsRepository();
        const result = yield IR.getOwnershipData(176372);
        res.send(result.success ? result.data : result);
    }));
    app.get("/api/payments", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const IR = yield new incidents_repository_1.IncidentsRepository().getRepository();
        const incident = yield IR.findOne(183611);
        const result = yield new ownership_closing_report_1.OwnershipClosingReport().send(incident);
        res.send(result.success ? result.data.content : result);
    }));
}
exports.routes = routes;
//# sourceMappingURL=jobs-routes.js.map