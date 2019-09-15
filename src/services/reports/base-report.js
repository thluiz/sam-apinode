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
const Ejs = require("ejs");
const path = require("path");
const Branch_1 = require("../../entity/Branch");
const database_manager_1 = require("../managers/database-manager");
const configurations_services_1 = require("../configurations-services");
const logger_service_1 = require("../logger-service");
const errors_codes_1 = require("../../helpers/errors-codes");
const result_1 = require("../../helpers/result");
const email_manager_1 = require("../managers/email-manager");
class BaseReport {
    constructor() {
        this.DBM = new database_manager_1.DatabaseManager();
    }
    getIMEmail() {
        return __awaiter(this, void 0, void 0, function* () {
            return configurations_services_1.ConfigurationsService.getConfiguration(configurations_services_1.Configurations.EMAIL_IM);
        });
    }
    getBranchEmail(branchId) {
        return __awaiter(this, void 0, void 0, function* () {
            const BR = yield this.DBM.getRepository(Branch_1.Branch);
            const branch = yield BR.findOne(branchId);
            return branch.contact_email;
        });
    }
    render_template(name, data) {
        return new Promise((resolve) => {
            try {
                const templatePath = path.join(__dirname, `templates/${name}.html`);
                Ejs.renderFile(templatePath, { data }, (err, content) => {
                    if (err) {
                        logger_service_1.LoggerService.error(errors_codes_1.ErrorCode.SendingEmail, err);
                        resolve(result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, err));
                        return;
                    }
                    resolve(result_1.SuccessResult.GeneralOk(content));
                });
            }
            catch (error) {
                logger_service_1.LoggerService.error(errors_codes_1.ErrorCode.SendingEmail, error);
                resolve(result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, error));
            }
        });
    }
    send_email(msg) {
        return email_manager_1.EmailManager.send_email(msg);
    }
}
exports.BaseReport = BaseReport;
//# sourceMappingURL=base-report.js.map