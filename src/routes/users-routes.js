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
const result_1 = require("../helpers/result");
const security_service_1 = require("../services/security-service");
function routes(app) {
    app.get("/api/users/current", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const userReq = yield new security_service_1.SecurityService().getUserFromRequest(req);
            const user = yield (new security_service_1.SecurityService()).serializeUser(userReq);
            res.send(result_1.SuccessResult.GeneralOk(user));
        }
        catch (error) {
            res.status(500).json({ error });
        }
    }));
    app.post("/api/password_request", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const passReq = yield new security_service_1.SecurityService().createPasswordRequest(req.body.email);
        res.send(passReq);
    }));
    app.post("/api/reset_password", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const passReq = yield new security_service_1.SecurityService().resetPassword(req.body.code, req.body.password, req.body.confirm);
        res.send(passReq);
    }));
}
exports.routes = routes;
//# sourceMappingURL=users-routes.js.map