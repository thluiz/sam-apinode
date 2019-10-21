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
const result_1 = require("../../helpers/result");
const base_report_1 = require("./base-report");
const configurations_services_1 = require("../configurations-services");
class VoucherPersonRegisterdReport extends base_report_1.BaseReport {
    constructor() {
        super();
        this.templateName = "ownership_closing_report";
    }
    send(voucher) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = {
                to: (yield this.buildRecipients(voucher.branch_id)),
                from: "contato@myvtmi.im",
                subject: `Cadastro pelo Voucher`,
                html: `
                    <p>Name: ${voucher.name}</p>
                    <p>Email: ${voucher.email || "ND"}</p>
                    <p>CPF: ${voucher.cpf || "ND"}</p>
                    <p>Phone: ${voucher.phone || "ND"}</p>
                    <p>Links: ${voucher.socialLinks || "ND"}</p>
                    <p>Voucher: ${voucher.voucher_id || "ND"}</p>
                    <p>Invite: ${voucher.invite_key || "ND"}</p>
                    <p>Schedule: ${voucher.branch_map_id || "ND"}</p>
                `,
            };
            yield this.send_email(msg);
            return result_1.SuccessResult.GeneralOk(msg);
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
}
exports.VoucherPersonRegisterdReport = VoucherPersonRegisterdReport;
//# sourceMappingURL=voucher-person-registered-report.js.map