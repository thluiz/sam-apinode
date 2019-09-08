import { QueryRunner } from "typeorm";
import { EnumRelationshipType } from "../entity/EnumRelationshipType";
import { PersonRelationship } from "../entity/PersonRelationship";
import { DatabaseManager } from "./managers/database-manager";

import { Result, SuccessResult } from "../helpers/result";

export class InvitationsService {
    static DBF = new DatabaseManager();

    static async change_invite_type(inviteId: number, newType: number): Promise<Result<any>> {
        return this.DBF.ExecuteWithinTransaction(async (qr: QueryRunner) => {
            const invite = await qr.manager.findOne(PersonRelationship, {id: inviteId});
            const relationshipType = newType === 0 ? 13 : newType === 1 ? 10 : 14;

            invite.relationship_type = await qr.manager
            .findOne(EnumRelationshipType, {id: relationshipType});

            await qr.manager.save(invite);

            return SuccessResult.GeneralOk();
        });
    }
}
