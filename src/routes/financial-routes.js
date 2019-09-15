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
const auth = require("../middlewares/auth");
const database_manager_1 = require("../services/managers/database-manager");
const dependency_manager_1 = require("../services/managers/dependency-manager");
function routes(app) {
    const DBM = dependency_manager_1.DependencyManager.container.resolve(database_manager_1.DatabaseManager);
    app.get("/api/financial/accounts/:branch_id?", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSQL(`select a.*, isnull(b.abrev, 'Gestão Integrada') branch, isnull(b.initials, 'GI') branch_initials
          from account a
            left join branch b on b.id = a.branch_id
          where a.active = 1
            and ((@0 is null and a.branch_id is null) or (a.branch_id = @0))
          order by [order]
          for json path`, req.params.branch_id || null);
        res.send(result);
    }));
    app.get("/api/financial_board/expected_payments/:account", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP("GetPaymentsInPeriod", { account_id: req.params.account }, { start_date: req.params.start_date || null }, { end_date: req.params.end_date || null });
        res.send(result);
    }));
    app.get("/api/financial_board/account_status/:account", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP("GetAccountStatusInPeriod", { account_id: req.params.account }, { start_date: req.params.start_date || null }, { end_date: req.params.end_date || null });
        res.send(result);
    }));
    app.get("/api/financial_board/missing_payments/:account", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP("GetMissingPayments", {
            account_id: req.params.account
        });
        res.send(result);
    }));
    app.post("/api/financial/accounts", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const account = req.body.account;
        if (account.id > 0) {
            yield DBM.ExecuteSQLNoResults(`update account set
                name = @1,
                [order] = @2
            where id = @0`, account.id, account.name, account.order);
        }
        else {
            yield DBM.ExecuteSQLNoResults(`insert into account (name, [order], branch_id, active)
                    values (@0, @1, @2, 1)`, account.name, account.order, account.branch);
        }
        res.send({ sucess: true });
    }));
}
exports.routes = routes;
//# sourceMappingURL=financial-routes.js.map