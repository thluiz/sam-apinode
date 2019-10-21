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
const auth = require("../middlewares/auth");
const relationship_service_1 = require("../services/relationship-service");
function routes(app) {
    app.get("/api/relationships/person/:id", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield relationship_service_1.RelationshipService.load_person_relationship(req.params.id);
        res.send(result);
    }));
}
exports.routes = routes;
//# sourceMappingURL=relationship-routes.js.map