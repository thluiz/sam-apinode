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
const auth = require("../../middlewares/auth");
const people_service_1 = require("../../services/people-service");
const errors_codes_1 = require("../../helpers/errors-codes");
const result_1 = require("../../helpers/result");
const database_manager_1 = require("../../services/managers/database-manager");
const dependency_manager_1 = require("../../services/managers/dependency-manager");
const jobs_service_1 = require("../../services/jobs-service");
const logger_service_1 = require("../../services/logger-service");
const parameters_service_1 = require("../../services/parameters-service");
const voucher_person_registered_report_1 = require("../../services/reports/voucher-person-registered-report");
const Branch_1 = require("../../entity/Branch");
const Voucher_1 = require("../../entity/Voucher");
function routes(app) {
    const DBM = dependency_manager_1.DependencyManager.container.resolve(database_manager_1.DatabaseManager);
    const PS = new people_service_1.PeopleService();
    const PrS = new parameters_service_1.ParametersService();
    app.get("/api/vouchers/:id?", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const VR = yield DBM.getRepository(Voucher_1.Voucher);
        const vouchers = req.params.id > 0 ?
            yield VR.find({ where: { id: req.params.id }, relations: ["branches", "voucher_type"] })
            : yield VR.find({ order: { active: "DESC" }, relations: ["voucher_type"] });
        res.send(result_1.SuccessResult.GeneralOk(vouchers));
    }));
    app.post("/api/parameters/voucher_branch/add", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const BR = yield DBM.getRepository(Branch_1.Branch);
        const VR = yield DBM.getRepository(Voucher_1.Voucher);
        const branch = yield BR.findOne(req.body.branch.id);
        const voucher = yield VR.findOne(req.body.voucher.id);
        res.send(yield PrS.create_branch_voucher(branch, voucher));
    }));
    app.post("/api/parameters/voucher_branch/remove", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const BR = yield DBM.getRepository(Branch_1.Branch);
        const VR = yield DBM.getRepository(Voucher_1.Voucher);
        const branch = yield BR.findOne(req.body.branch.id);
        const voucher = yield VR.findOne(req.body.voucher.id);
        res.send(yield PrS.remove_branch_voucher(branch, voucher));
    }));
    app.post("/api/parameters/vouchers", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const voucherData = req.body.voucher;
        const result = yield PrS.save_voucher(voucherData);
        if (!result.success) {
            res.send(result);
            return;
        }
        try {
            const resultVoucher = yield new jobs_service_1.JobsService().update_voucher_site();
            if (!resultVoucher.success) {
                const e = resultVoucher;
                e.innerError = e;
                e.errorCode = errors_codes_1.ErrorCode.ParcialExecution;
            }
            res.send(resultVoucher);
        }
        catch (error) {
            res.send(result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.ParcialExecution, error));
        }
    }));
    /**********************************************
     * EXTERNAL ROUTES
     **********************************************/
    app.post("/api/voucher", (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            logger_service_1.LoggerService.info(logger_service_1.LogOrigins.ExternalResource, req.body);
            const data = {
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
            yield new voucher_person_registered_report_1.VoucherPersonRegisterdReport().send(data);
            yield PS.create_person_from_voucher(data);
        }
        catch (error) {
            logger_service_1.LoggerService.error(errors_codes_1.ErrorCode.ExternalResource, error);
        }
        res.send({ sucess: true });
    }));
    app.get("/api/voucher/invites", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP("GetInvitesForVoucher");
        res.send(result.data);
    }));
    app.get("/api/voucher/data", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP("GetDataForVoucher");
        res.send(result.data);
    }));
}
exports.routes = routes;
//# sourceMappingURL=voucher-routes.js.map