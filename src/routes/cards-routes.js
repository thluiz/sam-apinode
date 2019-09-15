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
const errors_codes_1 = require("../helpers/errors-codes");
const cards_service_1 = require("../services/cards-service");
const logger_service_1 = require("../services/logger-service");
const security_service_1 = require("../services/security-service");
const cards_repository_1 = require("../repositories/cards-repository");
const database_manager_1 = require("../services/managers/database-manager");
const dependency_manager_1 = require("../services/managers/dependency-manager");
function routes(app) {
    const DBM = dependency_manager_1.DependencyManager.container.resolve(database_manager_1.DatabaseManager);
    const CS = new cards_service_1.CardsService();
    const SS = new security_service_1.SecurityService();
    app.get("/api/cards/:id", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonListSQL("select * from vwCard where id = @0 for json path", req.params.id);
        res.send(result);
    }));
    app.get("/api/person_card_positions", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonListSQL("select * from person_card_position where active = 1 for json path");
        res.send(result);
    }));
    app.get("/api/operators", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonListSQL(`select *
                from vwPerson v
                where is_operator = 1 or is_director = 1 or is_manager = 1
                order by name for json path`);
        res.send(result);
    }));
    app.get("/api/card_templates", auth.ensureLoggedIn(), (_, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonListSQL(`select *
                from card_template
                where active = 1
                order by [order]
                for json path`);
        res.send(result);
    }));
    app.get("/api/organizations/flat", auth.ensureLoggedIn(), (_, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP("GetFlatOrganizationsData");
        res.send(result);
    }));
    app.get("/api/organizations/:id?/:include_childrens?", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield new cards_repository_1.CardsRepository().getOrganizations(req.params.id, req.params.include_childrens);
            res.send(result);
        }
        catch (error) {
            logger_service_1.LoggerService.error(errors_codes_1.ErrorCode.CardsActions, error);
            res.status(500).json(error);
        }
    }));
    app.get("/api/projects/:id", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield new cards_repository_1.CardsRepository().getProject(req.params.id);
            res.send(result);
        }
        catch (error) {
            logger_service_1.LoggerService.error(errors_codes_1.ErrorCode.CardsActions, error);
            res.status(500).json(error);
        }
    }));
    app.post("/api/person_cards", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield CS.save_person_card(req.body.person_card);
        res.send(result);
    }));
    app.post("/api/cards", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const user = yield SS.getUserFromRequest(req);
        const result = yield CS.save_card(req.body.card, yield user.getPersonId());
        res.send(result);
    }));
    app.post("/api/move_card", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const user = yield SS.getUserFromRequest(req);
        const result = CS.moveCard(req.body, user);
        res.send(result);
    }));
    app.post("/api/cards_comments", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const user = yield SS.getUserFromRequest(req);
        const result = yield CS.save_card_comment(req.body.card, req.body.comment, req.body.commentary_type, yield user.getPersonId());
        res.send(result);
    }));
    app.get("/api/cards_comments/:card_id", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP("GetCardCommentaries", {
            card_id: req.params.card_id
        });
        res.send(result);
    }));
    app.post("/api/cards/steps", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const user = yield SS.getUserFromRequest(req);
        const result = yield CS.save_card_step(req.body.card_id, req.body.step_id, yield user.getPersonId());
        res.send(result);
    }));
    app.post("/api/cards/steps/card_order", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield CS.save_card_order(req.body.card_id, req.body.order);
        res.send(result);
    }));
    app.post("/api/person_cards/delete", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield CS.remove_person_card(req.body.person_card);
        res.send(result);
    }));
    app.post("/api/archive_card", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const user = yield SS.getUserFromRequest(req);
        const result = yield CS.toggle_card_archived(req.body.card, yield user.getPersonId());
        res.send(result);
    }));
}
exports.routes = routes;
//# sourceMappingURL=cards-routes.js.map