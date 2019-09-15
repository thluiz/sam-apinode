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
const Branch_1 = require("../../entity/Branch");
const Country_1 = require("../../entity/Country");
const Location_1 = require("../../entity/Location");
const errors_codes_1 = require("../../helpers/errors-codes");
const result_1 = require("../../helpers/result");
const database_manager_1 = require("../../services/managers/database-manager");
const dependency_manager_1 = require("../../services/managers/dependency-manager");
function routes(app) {
    const DBM = dependency_manager_1.DependencyManager.container.resolve(database_manager_1.DatabaseManager);
    app.get("/api/locations", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const LR = yield DBM.getRepository(Location_1.Location);
            let query = yield LR.createQueryBuilder("l")
                .innerJoinAndSelect("l.country", "c")
                .leftJoinAndSelect("l.branch", "b")
                .orderBy("l.active desc, l.order");
            if (req.query.active) {
                query = query.where("l.active = :0", req.query.active);
            }
            const result = yield query.getMany();
            res.send(result_1.SuccessResult.GeneralOk(result));
        }
        catch (error) {
            res.status(500).json(result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, error));
        }
    }));
    app.post("/api/locations", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const LR = yield DBM.getRepository(Location_1.Location);
            const loc = req.body.location;
            const location = loc.id > 0 ? yield LR.findOne(loc.id) : new Location_1.Location();
            if (loc.branch && loc.branch.id > 0) {
                const BR = yield DBM.getRepository(Branch_1.Branch);
                location.branch = yield BR.findOne(loc.branch.id);
            }
            if (loc.country && loc.country.id > 0) {
                const CR = yield DBM.getRepository(Country_1.Country);
                location.country = yield CR.findOne(loc.country.id);
            }
            location.active = loc.active;
            location.description = loc.description;
            location.name = loc.name;
            location.order = loc.order;
            const result = yield LR.save(location);
            res.send(result_1.SuccessResult.GeneralOk(result));
        }
        catch (error) {
            res.status(500).json(result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, error));
        }
    }));
}
exports.routes = routes;
//# sourceMappingURL=locations-routes.js.map