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
const incidents_controller_1 = require("../controllers/incidents-controller");
const incidents_service_1 = require("../services/incidents-service");
const security_service_1 = require("../services/security-service");
function routes(app) {
    const IR = new incidents_repository_1.IncidentsRepository();
    const IS = new incidents_service_1.IncidentsService();
    const SS = new security_service_1.SecurityService();
    const controller = new incidents_controller_1.IncidentsController();
    app.get("/api/available_ownerships/:branch/:date/:type", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield IR.getAvailableOwnerships(req.params.branch, req.params.date, req.params.type);
        res.send(result);
    }));
    app.get("/api/calendar/:start_date/:end_date", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield IR.getCalendarData(req.params.start_date, req.params.end_date);
        res.send(result);
    }));
    app.get("/api/change_ownership/:id", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield IR.getDataForChangeOwnership(req.params.id);
        res.send(result);
    }));
    app.get("/api/change_ownership_length/:id/:start_date/:end_date", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield IR.getDataForChangeOwnershipLength(req.params.id, req.params.start_date, req.params.end_date);
        res.send(result);
    }));
    app.post("/api/change_ownership", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const user = yield SS.getUserFromRequest(req);
        const result = yield IS.ChangeOwnership(req.body.id, req.body.owner, req.body.first_surrogate, req.body.second_surrogate, req.body.description, yield user.getPersonId());
        res.send(result);
    }));
    app.post("/api/change_ownership_length", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const user = yield SS.getUserFromRequest(req);
        const result = yield IS.ChangeOwnershipLength(req.body.id, req.body.start_date, req.body.end_date, yield user.getPersonId());
        res.send(result);
    }));
    app.get("/api/current_activities/:branch?", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield IR.getCurrentActivities(req.params.branch > 0 ? req.params.branch : null);
        res.send(result);
    }));
    app.get("/api/incidents/history/:person/:start_date/:end_date/:activity_type?", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield IR.getPersonIncidentsHistory(req.params.person, req.params.start_date, req.params.end_date, req.params.activity_type);
        res.send(result);
    }));
    app.get("/api/incidents/:id", auth.ensureLoggedIn(), (request, response) => __awaiter(this, void 0, void 0, function* () {
        const result = yield IR.getIncidentDetails(request.params.id);
        response.send(result);
    }));
    app.get("/api/agenda/:branch?/:date?", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield IR.getAgenda(req.params.branch > 0 ? req.params.branch : null, req.params.date);
        res.send(result);
    }));
    app.get("/api/incidents-without-ownership/:branch_id/:location_id/:start_date/:end_date", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield IR.getIncidentsWithOutOwnership(req.params.branch_id, req.params.location_id, req.params.start_date, req.params.end_date);
        res.send(result);
    }));
    app.get("/api/daily/:branch?/:display?/:display_modifier?", auth.ensureLoggedIn(), (request, response) => __awaiter(this, void 0, void 0, function* () {
        const result = yield IR.getDailyMonitor(request.params.branch > 0 ? request.params.branch : null, request.params.display || 0, request.params.display_modifier || 0);
        response.send(result);
    }));
    app.get("/api/people_summary/:branch?/:week?", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield IR.getPeopleSummary(req.params.branch > 0 ? req.params.branch : null, req.params.week || 0, req.params.date);
        res.send(result);
    }));
    app.get("/api/sumary/:branch?/:month?/:week?/:date?", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield IR.getSummary(req.params.branch > 0 ? req.params.branch : null, req.params.month || 0, req.params.week || 0, req.params.date);
        res.send(result);
    }));
    app.post("/api/incident/close", auth.ensureLoggedIn(), (req, response) => __awaiter(this, void 0, void 0, function* () {
        const result = yield controller.close_incident(req.body, yield SS.getUserFromRequest(req));
        response.send(result);
    }));
    app.post("/api/incident_actions", auth.ensureLoggedIn(), (req, response) => __awaiter(this, void 0, void 0, function* () {
        const user = yield SS.getUserFromRequest(req);
        const result = yield IS.addAction(req.body.action, yield user.getPersonId());
        response.send(result);
    }));
    app.post("/api/incident_action/complete", auth.ensureLoggedIn(), (req, response) => __awaiter(this, void 0, void 0, function* () {
        const user = yield SS.getUserFromRequest(req);
        const result = yield IS.completeAction(req.body, yield user.getPersonId());
        response.send(result);
    }));
    app.post("/api/incident_action/treatment", auth.ensureLoggedIn(), (req, response) => __awaiter(this, void 0, void 0, function* () {
        const user = yield SS.getUserFromRequest(req);
        const result = yield IS.treatAction({
            action_id: req.body.action_id,
            incident_id: req.body.incident_id,
            treatment_date: req.body.treatment_date,
            treatment_type: req.body.treatment_type,
            treatment_description: req.body.treatment_description,
            responsible_id: yield user.getPersonId()
        });
        response.send(result);
    }));
    app.post("/api/incident/start", auth.ensureLoggedIn(), (req, response) => __awaiter(this, void 0, void 0, function* () {
        const user = yield SS.getUserFromRequest(req);
        const result = yield IS.start_incident({ id: req.body.id }, yield user.getPersonId());
        response.send(result);
    }));
    app.post("/api/incident/reopen", auth.ensureLoggedIn(), (req, response) => __awaiter(this, void 0, void 0, function* () {
        const user = yield SS.getUserFromRequest(req);
        const result = yield IS.reopen_incident({ id: req.body.id }, yield user.getPersonId());
        response.send(result);
    }));
    app.post("/api/incident/start/cancel", auth.ensureLoggedIn(), (req, response) => __awaiter(this, void 0, void 0, function* () {
        const user = yield SS.getUserFromRequest(req);
        const result = yield IS.cancel_start_incident({ id: req.body.id }, yield user.getPersonId());
        response.send(result);
    }));
    app.post("/api/incident/remove", auth.ensureLoggedIn(), (request, response) => __awaiter(this, void 0, void 0, function* () {
        const user = yield SS.getUserFromRequest(request);
        const result = yield IS.remove_incident({ id: request.body.id }, yield user.getPersonId());
        response.send(result);
    }));
    app.post("/api/incident/reschedule", auth.ensureLoggedIn(), (request, response) => __awaiter(this, void 0, void 0, function* () {
        const user = yield SS.getUserFromRequest(request);
        const result = yield IS.reschedule_incident(request.body.incident, request.body.new_incident, request.body.contact.contact_text, yield user.getPersonId());
        response.send(result);
    }));
    app.post("/api/incident/register_incident", auth.ensureLoggedIn(), (request, response) => __awaiter(this, void 0, void 0, function* () {
        const user = yield SS.getUserFromRequest(request);
        const result = yield IS.register_incident(request.body.incident, yield user.getPersonId());
        response.send(result);
    }));
    app.post("/api/incident/register_contact", auth.ensureLoggedIn(), (request, response) => __awaiter(this, void 0, void 0, function* () {
        const user = yield SS.getUserFromRequest(request);
        const result = yield IS.register_contact_for_incident(request.body.incident, request.body.contact.contact_text, yield user.getPersonId());
        response.send(result);
    }));
    /**
     * COMMENTS
     */
    app.get("/api/incident_comments/incident/:id/:show_archived?", auth.ensureLoggedIn(), (request, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield IS.get_comments(request.params.id, request.params.show_archived || false);
        res.send(result);
    }));
    app.post("/api/incident_action_comments", auth.ensureLoggedIn(), (request, res) => __awaiter(this, void 0, void 0, function* () {
        const user = yield SS.getUserFromRequest(request);
        const result = yield IS.save_action_comment(request.body.incident_action_id, request.body.comment, yield user.getPersonId());
        res.send(result);
    }));
    app.post("/api/incident_comments", auth.ensureLoggedIn(), (request, res) => __awaiter(this, void 0, void 0, function* () {
        const user = yield SS.getUserFromRequest(request);
        const result = yield IS.save_comment(request.body.incident_id, request.body.comment, yield user.getPersonId());
        res.send(result);
    }));
    app.post("/api/incident_comments/archive", auth.ensureLoggedIn(), (request, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield IS.archive_comment(request.body.id);
        res.send(result);
    }));
}
exports.routes = routes;
//# sourceMappingURL=incidents-routes.js.map