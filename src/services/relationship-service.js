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
const PersonRelationship_1 = require("../entity/PersonRelationship");
const database_manager_1 = require("./managers/database-manager");
const errors_codes_1 = require("../helpers/errors-codes");
const result_1 = require("../helpers/result");
const DBM = new database_manager_1.DatabaseManager();
class RelationshipService {
    static load_person_relationship(personId, includeIndications = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const PR = yield DBM.getRepository(PersonRelationship_1.PersonRelationship);
                const excludeIndications = includeIndications ? ""
                    : "and (person2_id = :id or (person_id != :id and relationship_type not in (10,13,14)))";
                const entities = yield PR
                    .createQueryBuilder("pr")
                    .innerJoinAndSelect("pr.relationship_type", "rt")
                    .innerJoinAndSelect("pr.parent_person", "parent_person")
                    .innerJoinAndSelect("pr.target_person", "target_person")
                    .where(`(pr.person_id = :id or pr.person2_id = :id) ${excludeIndications}`, { id: personId })
                    .getMany();
                return result_1.SuccessResult.GeneralOk(entities);
            }
            catch (error) {
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        });
    }
}
exports.RelationshipService = RelationshipService;
//# sourceMappingURL=relationship-service.js.map