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
const jobs_service_1 = require("../../services/jobs-service");
const database_manager_1 = require("../../services/managers/database-manager");
const parameters_service_1 = require("../../services/parameters-service");
const errors_codes_1 = require("../../helpers/errors-codes");
const result_1 = require("../../helpers/result");
const dependency_manager_1 = require("../../services/managers/dependency-manager");
function routes(app) {
    const PS = new parameters_service_1.ParametersService();
    const DBM = dependency_manager_1.DependencyManager.container.resolve(database_manager_1.DatabaseManager);
    app.get("/api/branches/:id?", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = !req.params.id
                ? yield DBM.ExecuteJsonSP(`GetBranches`)
                : yield DBM.ExecuteJsonListSQL(`select * from vwBranch where id = @0 for json path`, req.params.id);
            res.send(result);
        }
        catch (error) {
            res.status(500).json({ error });
        }
    }));
    app.get("/api/branches_timezones", (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield DBM.ExecuteJsonSP(`GetBranchesTimezones`);
            res.send(result);
        }
        catch (error) {
            res.status(500).json({ error });
        }
    }));
    app.get("/api/all_branches/:id?", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = !req.params.id
                ? yield DBM.ExecuteJsonSP(`GetBranches`, { active: null })
                : yield DBM.ExecuteJsonListSQL(`select * from vwBranch where id = @0 for json path`, req.params.id);
            res.send(result);
        }
        catch (error) {
            res.status(500).json({ error });
        }
    }));
    app.post("/api/branches_new", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield PS.create_branch(req.body.branch);
        if (!result.success) {
            res.send(result);
            return;
        }
        const updateVoucher = yield new jobs_service_1.JobsService().update_voucher_site();
        if (!updateVoucher.success) {
            res.send(result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.ParcialExecution, updateVoucher.data, updateVoucher));
            return;
        }
        res.send(result);
    }));
    app.get("/api/branch_maps/branch/:id", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP("GetBranchMap", {
            branch_id: req.params.id
        });
        res.send(result);
    }));
    app.get("/api/branch_products/branch/:id", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP("GetBranchProducts", {
            branch_id: req.params.id
        });
        res.send(result);
    }));
    app.post("/api/branch_maps/archive", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteSQLNoResults(`update branch_map set active = 0 where id = @0`, req.body.id);
        if (!result.success) {
            res.send(result);
            return;
        }
        const resultSiteUpdate = yield new jobs_service_1.JobsService().update_voucher_site();
        res.send(resultSiteUpdate);
    }));
    app.post("/api/branch_products/:id", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP("SaveBranchProduct", { id: req.body.id }, { branch_id: req.params.id }, { currency_id: req.body.currency_id }, { category_id: req.body.category_id }, { name: req.body.name }, { base_value: req.body.base_value });
        res.send(result);
    }));
    app.post("/api/branch_products/archive/:branch_id", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteSQLNoResults(`update branch_product set archived = 1 where id = @0`, req.body.product.id);
        res.send(result);
    }));
    app.post("/api/branch_products", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP("AssociateBranchProduct", { branch_id: req.body.branch_id }, { product_id: req.body.product_id }, { base_value: req.body.base_value });
        res.send(result);
    }));
    app.post("/api/branch_maps", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const weekDays = req.body.week_days
            .filter(wk => wk.selected)
            .map(wk => {
            return wk.week_day;
        })
            .join(",");
        const result = yield DBM.ExecuteJsonSP("SaveBranchMap", { id: req.body.id || 0 }, { branch_id: req.body.branch_id }, { incident_type_id: req.body.incident_type_id }, { receive_voucher: req.body.receive_voucher }, { week_days: weekDays }, { start_hour: req.body.start_time ? req.body.start_time.hour : 0 }, { start_minute: req.body.start_time ? req.body.start_time.minute : 0 }, { end_hour: req.body.end_time ? req.body.end_time.hour : 0 }, { end_minute: req.body.end_time ? req.body.end_time.minute : 0 }, { title: req.body.title });
        if (!result.success) {
            res.send(result);
            return;
        }
        const resultSiteUpdate = yield new jobs_service_1.JobsService().update_voucher_site();
        res.send(resultSiteUpdate);
    }));
    app.post("/api/branches_acquirers", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP("ToggleBranchAcquirerAssociation", { branch_id: req.body.branch_id }, { acquirer_id: req.body.acquirer_id });
        res.send(result);
    }));
    app.post("/api/branches", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const branch = req.body.branch;
        const result = yield DBM.ExecuteSQLNoResults(`update branch set
            name = @1,
            abrev = @2,
            initials = @3,
            [order] = @4,
            contact_phone = @5,
            contact_email = @6,
            active = @7,
            default_currency_id = @8,
            timezone_id = @9
        where id = @0`, branch.id, branch.name, branch.abrev, branch.initials, branch.order, branch.contact_phone, branch.contact_email, branch.active, branch.default_currency_id, branch.timezone_id);
        res.send(result);
    }));
}
exports.routes = routes;
//# sourceMappingURL=branches-routes.js.map