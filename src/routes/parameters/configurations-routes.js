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
const database_manager_1 = require("../../services/managers/database-manager");
const dependency_manager_1 = require("../../services/managers/dependency-manager");
function routes(app) {
    const DBM = dependency_manager_1.DependencyManager.container.resolve(database_manager_1.DatabaseManager);
    app.get("/api/configurations", auth.ensureLoggedIn(), (request, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield DBM.ExecuteJsonListSQL(`select * from [configuration] for json path`);
            res.send(result);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
}
exports.routes = routes;
//# sourceMappingURL=configurations-routes.js.map