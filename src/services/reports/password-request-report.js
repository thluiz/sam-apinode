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
class PasswordRequestReport extends base_report_1.BaseReport {
    constructor() {
        super();
        this.templateName = "password-request-report";
    }
    send(user, passwordRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const person = yield user.getPerson();
            const generatedContent = yield this.render_template(this.templateName, {
                person, user, request: passwordRequest
            });
            const msg = {
                to: user.email,
                from: "contato@myvtmi.im",
                subject: `Redefinição de Senha`,
                html: generatedContent.data,
            };
            yield this.send_email(msg);
            return result_1.SuccessResult.GeneralOk(msg);
        });
    }
}
exports.PasswordRequestReport = PasswordRequestReport;
//# sourceMappingURL=password-request-report.js.map