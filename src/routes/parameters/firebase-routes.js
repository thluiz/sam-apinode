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
const firebase_manager_1 = require("../../services/managers/firebase-manager");
function routes(app) {
    app.get("/api/firebase/token", auth.ensureLoggedIn(), (_, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield firebase_manager_1.FirebaseManager.get_token();
        res.send(result);
    }));
    app.get("/api/firebase/current_time", (_, res) => __awaiter(this, void 0, void 0, function* () {
        const dt = new Date();
        res.send({
            milliseconds: dt.getTime(),
            date: dt
        });
    }));
}
exports.routes = routes;
//# sourceMappingURL=firebase-routes.js.map