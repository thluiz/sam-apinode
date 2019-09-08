import * as auth from "../../middlewares/auth";

import { PeopleService } from "../../services/people-service";

import { ErrorCode } from "../../helpers/errors-codes";
import { ErrorResult, SuccessResult } from "../../helpers/result";
import { DatabaseManager } from "../../services/managers/database-manager";
import { DependencyManager } from "../../services/managers/dependency-manager";

import { JobsService } from "../../services/jobs-service";
import { LoggerService, LogOrigins } from "../../services/logger-service";
import { ParametersService } from "../../services/parameters-service";
import { IPersonVoucherData } from "../../services/people-service";
import { VoucherPersonRegisterdReport } from "../../services/reports/voucher-person-registered-report";

import { Branch } from "../../entity/Branch";
import { Voucher } from "../../entity/Voucher";

export function routes(app) {
    const DBM = DependencyManager.container.resolve(DatabaseManager);
    const PS = new PeopleService();
    const PrS = new ParametersService();

    app.get("/api/vouchers/:id?",
    auth.ensureLoggedIn(),
    async (req, res, next) => {
        const VR = await DBM.getRepository<Voucher>(Voucher);

        const vouchers = req.params.id > 0 ?
                        await VR.find({ where: { id : req.params.id }, relations: ["branches", "voucher_type"]})
                        : await VR.find({ order: { active: "DESC" }, relations: ["voucher_type"] });

        res.send(SuccessResult.GeneralOk(vouchers));
    });

    app.post("/api/parameters/voucher_branch/add",
        auth.ensureLoggedIn(),
        async (req, res, next) => {
            const BR = await DBM.getRepository<Branch>(Branch);
            const VR = await DBM.getRepository<Voucher>(Voucher);

            const branch = await BR.findOne(req.body.branch.id);
            const voucher = await VR.findOne(req.body.voucher.id);

            res.send(await PrS.create_branch_voucher(branch, voucher));
        }
    );

    app.post("/api/parameters/voucher_branch/remove",
        auth.ensureLoggedIn(),
        async (req, res) => {
            const BR = await DBM.getRepository<Branch>(Branch);
            const VR = await DBM.getRepository<Voucher>(Voucher);

            const branch = await BR.findOne(req.body.branch.id);
            const voucher = await VR.findOne(req.body.voucher.id);

            res.send(await PrS.remove_branch_voucher(branch, voucher));
        }
    );

    app.post("/api/parameters/vouchers",
    auth.ensureLoggedIn(),
    async (req, res) => {
        const voucherData = req.body.voucher;

        const result = await PrS.save_voucher(voucherData);

        if (!result.success) {
            res.send(result);
            return;
        }

        try {
            const resultVoucher = await new JobsService().update_voucher_site();

            if (!resultVoucher.success) {
                const e = resultVoucher as ErrorResult;
                e.innerError = e;
                e.errorCode = ErrorCode.ParcialExecution;
            }

            res.send(resultVoucher);
        } catch (error) {
            res.send(ErrorResult.Fail(ErrorCode.ParcialExecution, error));
        }
    });

    /**********************************************
     * EXTERNAL ROUTES
     **********************************************/

    app.post("/api/voucher",
    async (req, res) => {
        try {
            LoggerService.info(LogOrigins.ExternalResource, req.body);

            const data: IPersonVoucherData = {
                name: req.body.name,
                email: req.body.email,
                cpf: req.body.cpf,
                phone: req.body.phone,
                socialLinks: req.body.socialLinks,
                branch_id: isNaN(req.body.unit) ? 1 : parseInt(req.body.unit, 10),
                branch_map_id: req.body.schedule || 0,
                voucher_id: req.body.voucher_id || 1,
                additionalAnswer: req.body.additionalAnswer || "",
                invite_key: req.body.invite
            };

            await new VoucherPersonRegisterdReport().send(data);

            await PS.create_person_from_voucher(data);
        } catch (error) {
            LoggerService.error(ErrorCode.ExternalResource, error);
        }
        res.send({ sucess: true});
    });

    app.get("/api/voucher/invites", async (req, res) => {
        const result = await DBM.ExecuteJsonSP("GetInvitesForVoucher");
        res.send(result.data);
    });

    app.get("/api/voucher/data", async (req, res) => {
        const result = await DBM.ExecuteJsonSP("GetDataForVoucher");
        res.send(result.data);
    });
}
