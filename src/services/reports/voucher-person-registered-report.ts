import { Result, SuccessResult } from "../../helpers/result";
import { BaseReport } from "./base-report";

import { ConfigurationsService } from "../configurations-services";
import { IPersonVoucherData } from "../people-service";

export class VoucherPersonRegisterdReport extends BaseReport {
    constructor() {
        super();
        this.templateName = "ownership_closing_report";
    }

    async send(voucher: IPersonVoucherData): Promise<Result> {
        const msg = {
            to: (await this.buildRecipients(voucher.branch_id)),
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

        await this.send_email(msg);

        return SuccessResult.GeneralOk(msg);
    }

    private async buildRecipients(branchId): Promise<string[]> {
        const result = [ ConfigurationsService.EMAIL_DEV ];

        const branchEmail = await this.getBranchEmail(branchId);
        if (branchEmail && branchEmail.length > 0) {
            result.push(branchEmail);
        }

        const imEmail = await this.getIMEmail();
        if (imEmail && imEmail.length > 0) {
            result.push(imEmail);
        }

        return result;
    }
}
