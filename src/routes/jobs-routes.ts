import { IncidentsRepository } from "../repositories/incidents-repository";
import { JobsService } from "../services/jobs-service";
import { OwnershipClosingReport } from "../services/reports/ownership-closing-report";

export function routes(app) {
    app.get("/api/hourly-jobs", async (req, res, next) => {
        const result = await new JobsService().execute_hourly_jobs();

        res.send(result);
    });

    app.get("/api/ownership_report", async (req, res, next) => {
        const IR = await new IncidentsRepository().getRepository();
        const incident = await IR.findOne(176372);

        const result = await new OwnershipClosingReport().send(incident);

        res.send(result.success ? result.data.content : result);
    });


    app.get("/api/json_ownership_report", async (req, res, next) => {
        const IR = await new IncidentsRepository();

        const result = await IR.getOwnershipData(176372);

        res.send(result.success ? result.data : result);
    });

    app.get("/api/payments", async (req, res, next) => {
        const IR = await new IncidentsRepository().getRepository();
        const incident = await IR.findOne(183611);

        const result = await new OwnershipClosingReport().send(incident);

        res.send(result.success ? result.data.content : result);
    });
}
