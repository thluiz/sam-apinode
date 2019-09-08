// tslint:disable-next-line:no-var-requires
require("dotenv").load();

import { QueryRunner } from "typeorm";
import { Branch } from "../../entity/Branch";
import { Incident } from "../../entity/Incident";
import { IncidentType } from "../../entity/IncidentType";

export async function create(runner: QueryRunner, type: IncidentType,
                             title = "Test", branchId = 1): Promise<Incident> {
    const BR = await runner.manager.getRepository<Branch>(Branch);

    const incident = new Incident();
    incident.type = type;
    incident.title = title;
    incident.date = new Date();
    incident.branch = (await BR.findOne(branchId));

    return incident;
}