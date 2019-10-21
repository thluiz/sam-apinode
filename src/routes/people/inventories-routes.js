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
const inventories_repository_1 = require("../../repositories/inventories-repository");
const inventories_service_1 = require("../../services/inventories-service");
const security_service_1 = require("../../services/security-service");
function routes(app) {
    const IvS = new inventories_service_1.InventoriesService();
    const IvR = new inventories_repository_1.InventoriesRepository();
    const SS = new security_service_1.SecurityService();
    app.get("/api/inventory_items", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        res.send(yield IvR.getAll());
    }));
    app.get("/api/people/personal_inventories", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        res.send(yield IvR.getAll());
    }));
}
exports.routes = routes;
//# sourceMappingURL=inventories-routes.js.map