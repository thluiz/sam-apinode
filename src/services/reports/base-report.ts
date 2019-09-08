import Ejs = require("ejs");
import path = require("path");

import { Branch } from "../../entity/Branch";
import { DatabaseManager } from "../managers/database-manager";

import { Configurations, ConfigurationsService } from "../configurations-services";
import { LoggerService } from "../logger-service";

import { ErrorCode } from "../../helpers/errors-codes";
import { ErrorResult, Result, SuccessResult } from "../../helpers/result";
import { EmailManager, IMessage } from "../managers/email-manager";

export class BaseReport {
    protected templateName: string;
    private DBM = new DatabaseManager();

    protected async getIMEmail(): Promise<string> {
        return ConfigurationsService.getConfiguration(Configurations.EMAIL_IM);
    }

    protected async getBranchEmail(branchId: number): Promise<string> {
        const BR = await this.DBM.getRepository<Branch>(Branch);
        const branch = await BR.findOne(branchId);

        return branch.contact_email;
    }

    protected render_template(name, data): Promise<Result<any>> {
        return new Promise((resolve) => {
            try {
                const templatePath = path.join(__dirname, `templates/${name}.html`);

                Ejs.renderFile(templatePath, { data }, (err, content) => {
                    if (err) {
                        LoggerService.error(ErrorCode.SendingEmail, err);

                        resolve(ErrorResult.Fail(ErrorCode.GenericError, err));
                        return;
                    }

                    resolve(SuccessResult.GeneralOk(content));
                });
            } catch (error) {
                LoggerService.error(ErrorCode.SendingEmail, error);
                resolve(ErrorResult.Fail(ErrorCode.GenericError, error));
            }
        });
    }

    protected send_email(msg: IMessage): Promise<Result<any>> {
        return EmailManager.send_email(msg);
    }
}
