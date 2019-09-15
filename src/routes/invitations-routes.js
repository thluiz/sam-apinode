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
const invitations_service_1 = require("../services/invitations-service");
const errors_codes_1 = require("../helpers/errors-codes");
const result_1 = require("../helpers/result");
function routes(app) {
    app.post("/api/invitations/change_type", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const indicationId = req.body.id;
        const newType = parseInt(req.body.type, 10);
        if (isNaN(newType)) {
            res.send(result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, new Error("Type not defined")));
            return;
        }
        const result = yield invitations_service_1.InvitationsService.change_invite_type(indicationId, newType);
        res.send(result);
    }));
}
exports.routes = routes;
//# sourceMappingURL=invitations-routes.js.map