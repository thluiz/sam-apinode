import { PersonRelationship } from "../entity/PersonRelationship";
import { DatabaseManager } from "./managers/database-manager";

import { ErrorCode } from "../helpers/errors-codes";
import { ErrorResult, Result, SuccessResult } from "../helpers/result";

const DBM = new DatabaseManager();

export class RelationshipService {
    static async load_person_relationship(personId: number, includeIndications = false)
    : Promise<Result<PersonRelationship[]>> {
        try {
            const PR = await DBM.getRepository<PersonRelationship>(PersonRelationship);
            const excludeIndications = includeIndications ? ""
            : "and (person2_id = :id or (person_id != :id and relationship_type not in (10,13,14)))";

            const entities = await PR
            .createQueryBuilder("pr")
            .innerJoinAndSelect("pr.relationship_type", "rt")
            .innerJoinAndSelect("pr.parent_person", "parent_person")
            .innerJoinAndSelect("pr.target_person", "target_person")
            .where(`(pr.person_id = :id or pr.person2_id = :id) ${excludeIndications}`, { id: personId })
            .getMany();

            return SuccessResult.GeneralOk(entities);
        } catch (error) {
            return ErrorResult.Fail(ErrorCode.GenericError, error);
        }
    }
}
