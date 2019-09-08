"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const incidents_service_1 = require("../services/incidents-service");
const Incident_1 = require("../entity/Incident");
class IncidentsController {
    constructor() {
        this.IS = new incidents_service_1.IncidentsService();
    }
    close_incident(incidentData, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const ir = yield this.IS.getRepository(Incident_1.Incident);
            const incident = yield ir.findOne(incidentData.id, { relations: ["type"] });
            incident.close_text = incidentData.close_text;
            incident.title = incidentData.title;
            incident.payment_method_id = incidentData.payment_method_id;
            incident.fund_value = incidentData.fund_value;
            const result = yield this.IS.close_incident_and_send_ownership_report(incident, yield user.getPerson());
            return result;
        });
    }
}
exports.IncidentsController = IncidentsController;
//# sourceMappingURL=incidents-controller.js.map