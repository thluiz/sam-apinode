

import { Result, SuccessResult } from "../../helpers/result";
import { BaseReport } from "./base-report";

import { ConfigurationsService } from "../configurations-services";
import { IPersonVoucherData } from "../people-service";

import { PasswordRequest } from "../../entity/PasswordRequest";
import { User } from "../../entity/User";

export class PasswordRequestReport extends BaseReport {
    constructor() {
        super();
        this.templateName = "password-request-report";
    }

    async send(user: User, passwordRequest: PasswordRequest): Promise<Result> {
        const person = await user.getPerson();

        const generatedContent = await this.render_template(this.templateName, {
            person, user, request: passwordRequest
        });

        const msg = {
            to: user.email,
            from: "contato@myvtmi.im",
            subject: `Redefinição de Senha`,
            html: generatedContent.data,
        };

        await this.send_email(msg);

        return SuccessResult.GeneralOk(msg);
    }
}
