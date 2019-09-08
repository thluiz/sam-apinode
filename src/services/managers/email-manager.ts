import { ErrorCode } from "../../helpers/errors-codes";
import { Result, SuccessResult } from "../../helpers/result";
import { ErrorResult } from "../../helpers/result";

import sgMail = require("@sendgrid/mail");
import { isArray } from "util";

import { ConfigurationsService } from "../configurations-services";
import { LoggerService } from "../logger-service";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export interface IMessage {
    to: string | string[];
    from: string;
    subject: string;
    html: string;
}

export class EmailManager {
    static send_email(msg: IMessage): Promise<Result<any>> {
        return new Promise<Result>((resolve, reject) => {
            if (process.env.PRODUCTION !== "true") {
                msg.subject += "[DEST:" +
                                    (isArray(msg.to) ?
                                        (msg.to as string[]).join(", ") : msg.to) +
                                "]";

                msg.to = ConfigurationsService.EMAIL_DEV;
            }

            sgMail.send(msg)
                .then((r2) => {
                    resolve(SuccessResult.GeneralOk(r2));
                })
                .catch((error) => {
                    // Extract error msg
                    // const { message, code, response } = error;
                    // Extract response msg
                    // const { headers, body } = response;
                    LoggerService.error(ErrorCode.SendingEmail, error,
                        `ERROR EMAIL :: ${msg.subject || "NO SUBJECT" }`);

                    reject(ErrorResult.Fail(ErrorCode.SendingEmail, error));
                });
        });
    }
}
