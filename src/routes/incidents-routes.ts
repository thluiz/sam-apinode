import * as auth from "../middlewares/auth";

import { IncidentsRepository } from "../repositories/incidents-repository";

import { IncidentsController } from "../controllers/incidents-controller";

import { IncidentsService } from "../services/incidents-service";
import { SecurityService } from "../services/security-service";

export function routes(app) {
    const IR = new IncidentsRepository();
    const IS = new IncidentsService();
    const SS = new SecurityService();
    const controller = new IncidentsController();

    app.get("/api/available_ownerships/:branch/:date/:type",
    auth.ensureLoggedIn(),
    async (req, res) => {
        const result = await IR.getAvailableOwnerships(req.params.branch, req.params.date, req.params.type);

        res.send(result);
    });

    app.get("/api/calendar/:start_date/:end_date",
    auth.ensureLoggedIn(),
    async (req, res) => {
        const result = await IR.getCalendarData(req.params.start_date, req.params.end_date);

        res.send(result);
    });

    app.get("/api/change_ownership/:id",
    auth.ensureLoggedIn(),
    async (req, res) => {
        const result = await IR.getDataForChangeOwnership(req.params.id);

        res.send(result);
    });

    app.get("/api/change_ownership_length/:id/:start_date/:end_date",
    auth.ensureLoggedIn(),
    async (req, res) => {
        const result = await IR.getDataForChangeOwnershipLength(
            req.params.id, req.params.start_date, req.params.end_date
        );

        res.send(result);
    });

    app.post("/api/change_ownership",
    auth.ensureLoggedIn(),
    async (req, res) => {
        const user = await SS.getUserFromRequest(req);
        const result = await IS.ChangeOwnership(
            req.body.id,
            req.body.owner,
            req.body.first_surrogate,
            req.body.second_surrogate,
            req.body.description,
            await user.getPersonId()
        );

        res.send(result);
    });

    app.post("/api/change_ownership_length",
    auth.ensureLoggedIn(),
    async (req, res) => {
        const user = await SS.getUserFromRequest(req);
        const result = await IS.ChangeOwnershipLength(
            req.body.id, req.body.start_date, req.body.end_date,
            await user.getPersonId()
        );

        res.send(result);
    });

    app.get("/api/current_activities/:branch?",
    auth.ensureLoggedIn(),
    async (req, res) => {
        const result = await IR.getCurrentActivities(req.params.branch > 0 ? req.params.branch : null);
        res.send(result);
    });

    app.get("/api/incidents/history/:person/:start_date/:end_date/:activity_type?",
    auth.ensureLoggedIn(),
    async (req, res) => {
        const result = await IR.getPersonIncidentsHistory( req.params.person,
            req.params.start_date, req.params.end_date,
            req.params.activity_type);

        res.send(result);
    });

    app.get("/api/incidents/:id",
    auth.ensureLoggedIn(),
    async (request, response) => {
        const result = await IR.getIncidentDetails( request.params.id );

        response.send(result);
    });

    app.get("/api/agenda/:branch?/:date?",
    auth.ensureLoggedIn(),
    async (req, res) => {
        const result = await IR.getAgenda(
            req.params.branch > 0 ? req.params.branch : null,
            req.params.date
        );

        res.send(result);
    });

    app.get("/api/incidents-without-ownership/:branch_id/:location_id/:start_date/:end_date",
    auth.ensureLoggedIn(),
    async (req, res) => {
        const result = await IR.getIncidentsWithOutOwnership(
            req.params.branch_id, req.params.location_id,
            req.params.start_date, req.params.end_date
        );

        res.send(result);
    });

    app.get("/api/daily/:branch?/:display?/:display_modifier?",
    auth.ensureLoggedIn(),
    async (request, response) => {
        const result = await IR.getDailyMonitor(
            request.params.branch > 0 ? request.params.branch : null,
            request.params.display || 0,
            request.params.display_modifier || 0
        );

        response.send(result);
    });

    app.get("/api/people_summary/:branch?/:week?",
    auth.ensureLoggedIn(),
    async (req, res) => {
        const result = await IR.getPeopleSummary(
            req.params.branch > 0 ? req.params.branch : null,
            req.params.week || 0,
            req.params.date
        );

        res.send(result);
    });

    app.get("/api/sumary/:branch?/:month?/:week?/:date?",
    auth.ensureLoggedIn(),
    async (req, res) => {
        const result = await IR.getSummary(
            req.params.branch > 0 ? req.params.branch : null,
            req.params.month || 0,
            req.params.week || 0,
            req.params.date
        );

        res.send(result);
    });

    app.post("/api/incident/close",
    auth.ensureLoggedIn(),
    async (req, response) => {
        const result = await controller.close_incident(
            req.body,
            await SS.getUserFromRequest(req)
        );

        response.send(result);
    });

    app.post("/api/incident_actions",
    auth.ensureLoggedIn(),
    async (req, response) => {
        const user = await SS.getUserFromRequest(req);
        const result = await IS.addAction(req.body.action, await user.getPersonId());

        response.send(result);
    });

    app.post("/api/incident_action/complete",
    auth.ensureLoggedIn(),
    async (req, response) => {
        const user = await SS.getUserFromRequest(req);
        const result = await IS.completeAction(req.body, await user.getPersonId());

        response.send(result);
    });

    app.post("/api/incident_action/treatment",
    auth.ensureLoggedIn(),
    async (req, response) => {
        const user = await SS.getUserFromRequest(req);
        const result = await IS.treatAction({
            action_id: req.body.action_id,
            incident_id: req.body.incident_id,
            treatment_date: req.body.treatment_date,
            treatment_type: req.body.treatment_type,
            treatment_description: req.body.treatment_description,
            responsible_id: await user.getPersonId()
        });

        response.send(result);
    });

    app.post("/api/incident/start",
    auth.ensureLoggedIn(),
    async (req, response) => {
        const user = await SS.getUserFromRequest(req);
        const result = await IS.start_incident({ id: req.body.id }, await user.getPersonId());

        response.send(result);
    });

    app.post("/api/incident/reopen",
    auth.ensureLoggedIn(),
    async (req, response) => {
        const user = await SS.getUserFromRequest(req);
        const result = await IS.reopen_incident({ id: req.body.id }, await user.getPersonId());

        response.send(result);
    });

    app.post("/api/incident/start/cancel",
    auth.ensureLoggedIn(),
    async (req, response) => {
        const user = await SS.getUserFromRequest(req);
        const result = await IS.cancel_start_incident({ id: req.body.id }, await user.getPersonId());

        response.send(result);
    });

    app.post("/api/incident/remove",
    auth.ensureLoggedIn(),
    async (request, response) => {
        const user = await SS.getUserFromRequest(request);
        const result = await IS.remove_incident({ id: request.body.id },
            await user.getPersonId());

        response.send(result);
    });

    app.post("/api/incident/reschedule",
    auth.ensureLoggedIn(),
    async (request, response) => {
        const user = await SS.getUserFromRequest(request);

        const result = await IS.reschedule_incident(
            request.body.incident,
            request.body.new_incident,
            request.body.contact.contact_text,
            await user.getPersonId()
        );

        response.send(result);
    });

    app.post("/api/incident/register_incident",
    auth.ensureLoggedIn(),
    async (request, response) => {
        const user = await SS.getUserFromRequest(request);
        const result = await IS.register_incident(
            request.body.incident,
            await user.getPersonId()
        );

        response.send(result);
    });

    app.post("/api/incident/register_contact",
    auth.ensureLoggedIn(),
    async (request, response) => {
        const user = await SS.getUserFromRequest(request);

        const result = await IS.register_contact_for_incident(
            request.body.incident,
            request.body.contact.contact_text,
            await user.getPersonId()
        );

        response.send(result);
    });

    /**
     * COMMENTS
     */

    app.get("/api/incident_comments/incident/:id/:show_archived?",
    auth.ensureLoggedIn(),
    async (request, res) => {
        const result = await IS.get_comments(
            request.params.id,
            request.params.show_archived || false);

        res.send(result);
    });

    app.post("/api/incident_action_comments",
    auth.ensureLoggedIn(),
    async (request, res) => {
        const user = await SS.getUserFromRequest(request);

        const result = await IS.save_action_comment(
            request.body.incident_action_id,
            request.body.comment,
            await user.getPersonId()
        );

        res.send(result);
    });

    app.post("/api/incident_comments",
    auth.ensureLoggedIn(),
    async (request, res) => {
        const user = await SS.getUserFromRequest(request);

        const result = await IS.save_comment(
            request.body.incident_id,
            request.body.comment,
            await user.getPersonId()
        );

        res.send(result);
    });

    app.post("/api/incident_comments/archive",
    auth.ensureLoggedIn(),
    async (request, res) => {
        const result = await IS.archive_comment(
            request.body.id
        );

        res.send(result);
    });
}
