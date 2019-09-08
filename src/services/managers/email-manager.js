"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_codes_1 = require("../../helpers/errors-codes");
const result_1 = require("../../helpers/result");
const result_2 = require("../../helpers/result");
const sgMail = require("@sendgrid/mail");
const util_1 = require("util");
const configurations_services_1 = require("../configurations-services");
const logger_service_1 = require("../logger-service");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
class EmailManager {
    static send_email(msg) {
        return new Promise((resolve, reject) => {
            if (process.env.PRODUCTION !== "true") {
                msg.subject += "[DEST:" +
                    (util_1.isArray(msg.to) ?
                        msg.to.join(", ") : msg.to) +
                    "]";
                msg.to = configurations_services_1.ConfigurationsService.EMAIL_DEV;
            }
            sgMail.send(msg)
                .then((r2) => {
                resolve(result_1.SuccessResult.GeneralOk(r2));
            })
                .catch((error) => {
                // Extract error msg
                // const { message, code, response } = error;
                // Extract response msg
                // const { headers, body } = response;
                logger_service_1.LoggerService.error(errors_codes_1.ErrorCode.SendingEmail, error, `ERROR EMAIL :: ${msg.subject || "NO SUBJECT"}`);
                reject(result_2.ErrorResult.Fail(errors_codes_1.ErrorCode.SendingEmail, error));
            });
        });
    }
}
exports.EmailManager = EmailManager;
//# sourceMappingURL=email-manager.js.map