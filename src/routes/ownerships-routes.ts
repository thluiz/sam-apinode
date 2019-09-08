import * as auth from "../middlewares/auth";
import { IncidentsRepository } from "../repositories/incidents-repository";
import { IncidentsService } from "../services/incidents-service";

export function routes(app) {
    const IS = new IncidentsService();
    const IR = new IncidentsRepository();

    app.get("/api/ownerships_converage/:id",
    auth.ensureLoggedIn(),
    async (req, response) => {
        const result = await IR.getOwnershipDataForCoverage(req.params.id);

        response.send(result);
    });

    app.get("/api/ownership_schedules/:id/:showPast?",
    auth.ensureLoggedIn(),
    async (req, response) => {
        const result = await IR.getOwnershipsFromSchedule(req.params.id, req.params.showPast == "1");

        response.send(result);
    });

    app.post("/api/ownerships/schedule",
    auth.ensureLoggedIn(),
    async (req, response) => {
        const result = await IS.scheduleOwnership(req.body.ownership);

        response.send(result);
    });

    app.post("/api/ownerships/migrate",
    auth.ensureLoggedIn(),
    async (req, response) => {
        const result = await IS.migrateOwnership(req.body.ownership, req.body.incidents);

        response.send(result);
    });
}