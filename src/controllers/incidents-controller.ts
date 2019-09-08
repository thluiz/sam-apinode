
import { IncidentsService } from "../services/incidents-service";

import { Incident } from "../entity/Incident";
import { User } from "../entity/User";

export class IncidentsController {
    private IS: IncidentsService;

    constructor() {
        this.IS = new IncidentsService();
    }

    async close_incident(incidentData, user: User) {

        const ir = await this.IS.getRepository(Incident);
        const incident = await ir.findOne(incidentData.id, {relations: [ "type" ]});
        incident.close_text = incidentData.close_text;
        incident.title = incidentData.title;
        incident.payment_method_id = incidentData.payment_method_id;
        incident.fund_value = incidentData.fund_value;

        const result = await this.IS.close_incident_and_send_ownership_report(
            incident, await user.getPerson()
        );

        return result;
    }
}
