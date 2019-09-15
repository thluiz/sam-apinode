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
const result_1 = require("../../helpers/result");
const base_report_1 = require("./base-report");
const incidents_repository_1 = require("../../repositories/incidents-repository");
const configurations_services_1 = require("../configurations-services");
class OwnershipClosingReport extends base_report_1.BaseReport {
    constructor() {
        super();
        this.IR = new incidents_repository_1.IncidentsRepository();
        this.templateName = "ownership_closing_report";
    }
    send(ownership) {
        return __awaiter(this, void 0, void 0, function* () {
            const owDataRequest = yield this.IR.getOwnershipData(ownership.id);
            const data = owDataRequest.data;
            const generatedContent = yield this.render_template(this.templateName, data);
            if (!generatedContent.success) {
                return generatedContent;
            }
            let subject = `Fechamento de titularidade - `;
            if (data.branch_name) {
                subject += ` ${data.branch_name} - `;
            }
            else {
                subject += ` Gestão Integrada - `;
            }
            subject += data.date;
            const msg = {
                to: (yield this.buildRecipients(data.branch_id)),
                from: "contato@myvtmi.im",
                subject,
                html: generatedContent.data,
            };
            yield this.send_email(msg);
            return result_1.SuccessResult.GeneralOk({ content: generatedContent.data, data });
        });
    }
    buildRecipients(branchId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [configurations_services_1.ConfigurationsService.EMAIL_DEV];
            const branchEmail = yield this.getBranchEmail(branchId);
            if (branchEmail && branchEmail.length > 0) {
                result.push(branchEmail);
            }
            const imEmail = yield this.getIMEmail();
            if (imEmail && imEmail.length > 0) {
                result.push(imEmail);
            }
            return result;
        });
    }
    formatDateBr(date) {
        const yyyy = date.getFullYear();
        const mm = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
        const dd = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        return "".concat(yyyy).concat("-").concat(mm).concat("-").concat(dd);
    }
}
exports.OwnershipClosingReport = OwnershipClosingReport;
//# sourceMappingURL=ownership-closing-report.js.map