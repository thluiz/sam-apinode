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
const EnumRelationshipType_1 = require("../entity/EnumRelationshipType");
const PersonRelationship_1 = require("../entity/PersonRelationship");
const database_manager_1 = require("./managers/database-manager");
const result_1 = require("../helpers/result");
class InvitationsService {
    static change_invite_type(inviteId, newType) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.DBF.ExecuteWithinTransaction((qr) => __awaiter(this, void 0, void 0, function* () {
                const invite = yield qr.manager.findOne(PersonRelationship_1.PersonRelationship, { id: inviteId });
                const relationshipType = newType === 0 ? 13 : newType === 1 ? 10 : 14;
                invite.relationship_type = yield qr.manager
                    .findOne(EnumRelationshipType_1.EnumRelationshipType, { id: relationshipType });
                yield qr.manager.save(invite);
                return result_1.SuccessResult.GeneralOk();
            }));
        });
    }
}
exports.InvitationsService = InvitationsService;
InvitationsService.DBF = new database_manager_1.DatabaseManager();
//# sourceMappingURL=invitations-service.js.map