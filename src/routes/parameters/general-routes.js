"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth = require("../../middlewares/auth");
const database_manager_1 = require("../../services/managers/database-manager");
const dependency_manager_1 = require("../../services/managers/dependency-manager");
function routes(app) {
    const DBM = dependency_manager_1.DependencyManager.container.resolve(database_manager_1.DatabaseManager);
    app.get("/api/server_timezone", (request, res) => __awaiter(this, void 0, void 0, function* () {
        const date = new Date();
        res.send({ timezone: 0 /* - date.getTimezoneOffset() / 60 */ });
    }));
    app.get("/api/countries", auth.ensureLoggedIn(), (request, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonListSQL(`select * from [country] order by [order] for json path`);
        res.send(result);
    }));
    app.get("/api/kf_families", auth.ensureLoggedIn(), (request, response) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP(`GetKungFuFamilies`);
        response.send(result);
    }));
    app.get("/api/recurrence_types", auth.ensureLoggedIn(), (req, response) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP(`GetRecurrenceTypes`);
        response.send(result);
    }));
    app.get("/api/relationship_types", auth.ensureLoggedIn(), (request, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonListSQL(`select * from [enum_relationship_type] where active = 1 for json path`);
        res.send(result);
    }));
    app.get("/api/incident_types", auth.ensureLoggedIn(), (request, response) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP(`GetIncidentTypes`);
        response.send(result);
    }));
    app.get("/api/contact_types", auth.ensureLoggedIn(), (request, response) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP(`GetContactTypes`);
        response.send(result);
    }));
    app.get("/api/roles", auth.ensureLoggedIn(), (request, response) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP(`GetRoles`);
        response.send(result);
    }));
    app.get("/api/groups", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonListSQL(`select * from [group] where active = 1 order by [order] for json path`);
        res.send(result);
    }));
    app.get("/api/payment_methods", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonListSQL(`select * from payment_method where active = 1 order by [order] for json path`);
        res.send(result);
    }));
    app.get("/api/acquirers", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonListSQL(`select * from acquirer where active = 1 order by [order] for json path`);
        res.send(result);
    }));
    app.get("/api/currencies", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonListSQL(`select * from currency for json path`);
        res.send(result);
    }));
    /**
     * UPDATES
     */
    app.post("/api/payment_methods", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const payment_method = req.body.payment_method;
        let result = null;
        if (payment_method.id > 0) {
            result = yield DBM.ExecuteSQLNoResults(`update payment_method set
            name = @name,
            [order] = @order
        where id = @id`, { id: payment_method.id }, { name: payment_method.name }, { order: payment_method.order });
        }
        else {
            result = yield DBM.ExecuteSQLNoResults(`insert into payment_method
            (name, [order])
        values
            (@name, @order)`, { name: payment_method.name }, { order: payment_method.order });
        }
        res.send(result);
    }));
    app.post("/api/acquirers", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const acquirer = req.body.acquirer;
        let result = null;
        if (acquirer.id > 0) {
            result = yield DBM.ExecuteSQLNoResults(`update acquirer set
            name = @1,
            [order] = @2
        where id = @0`, acquirer.id, acquirer.name, acquirer.order);
        }
        else {
            result = yield DBM.ExecuteSQLNoResults(`insert into acquirer
            (name, [order])
        values
            (@0, @1)`, acquirer.name, acquirer.order);
        }
        res.send(result);
    }));
    app.post("/api/currencies", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const currency = req.body.currency;
        let result = null;
        if (currency.id > 0) {
            result = yield DBM.ExecuteSQLNoResults(`update currency set
            name = @1,
            [symbol] = @2
        where id = @0`, currency.id, currency.name, currency.symbol);
        }
        else {
            result = yield DBM.ExecuteSQLNoResults(`insert into currency
            (name, [symbol])
        values
            (@0, @1)`, currency.name, currency.symbol);
        }
        res.send(result);
    }));
}
exports.routes = routes;
//# sourceMappingURL=general-routes.js.map