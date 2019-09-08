import { refreshMethodCache } from "../decorators/cache-decorator";
import { Result } from "../helpers/result";

import { DatabaseManager } from "./managers/database-manager";
import { DependencyManager } from "./managers/dependency-manager";

import { User } from "../entity/User";

export class CardsService {
    private DBM = DependencyManager.container.resolve(DatabaseManager);

    async correct_card_out_of_parent_step(): Promise<Result> {
        return await this.DBM.ExecuteSPNoResults("CorrectCardOutOfParentStep");
    }

    async moveCard(card, responsible: User) {
        const result = await this.DBM.ExecuteJsonSP(
            "MoveCard",
            { card_id: card.card_id },
            { parent_id: card.parent_id },
            { step_id: card.step_id },
            { responsible_id: await responsible.getPersonId() }
          );

        if (!result.success) {
            return result;
        }
    }

    async save_card(card, responsibleId) {
        let date = card.due_date ? `${card.due_date.year}-${card.due_date.month}-${card.due_date.day}` : null;

        if (date != null && card.due_time) {
            date += ` ${card.due_time.hour}:${card.due_time.minute}`;
        }

        if (card.id && card.id > 0) {
            return await this.DBM.ExecuteJsonSP("UpdateCard",
                {card_id:  card.id },
                {title: card.title },
                {due_date: date},
                {description: card.description},
                {location_id: card.locations != null && card.locations[0] ? card.locations[0].id : 1},
                {leader_id: card.leaders != null && card.leaders[0] ?
                                card.leaders[0].id : (card.leaders.person_id || card.leaders.id)},
                {abrev:  card.abrev },
                {responsible_id: responsibleId });
        }

        const result = await this.DBM.ExecuteJsonSP("SaveCard",
            {title: card.title},
            {parent_id: card.parent.id},
            {due_date: date},
            {description: card.description},
            {location_id: card.locations != null && card.locations[0] ? card.locations[0].id : 1},
            {card_template_id: card.template ? card.template.id : 3},
            {leader_id: card.leaders.person_id || card.leaders.id},
            {people: card.people ?
                        card.people
                        .filter((f) => f.person_id > 0)
                        .map((p) => p.person_id).join(",")
                        : null
            },
            {new_people: card.people ?
                        card.people
                        .filter((f) => f.person_id === 0)
                        .map((p) => p.name.trim())
                        .join(",")
                        : null
            },
            {abrev: card.abrev},
            {group_id: card.group ? card.group.id : null},
            {branch_id: card.branch ? card.branch.id : null},
            {responsible_id: responsibleId }
        );
        return result;
    }

    async save_person_card(personCard) {
        const result = await this.DBM.ExecuteSPNoResults("SavePersonCard",
            { card_id: personCard.card_id },
            { person_id: personCard.person_id },
            { position_id: personCard.position_id || 4 },
            { position_description: personCard.position_description },
            { order: personCard.order || -1 },
        );

        return result;
    }

    async remove_person_card(personCard: { card_id: number, person_id: number}) {
        const result = await this.DBM.ExecuteSPNoResults("RemovePersonCard",
            { card_id: personCard.card_id },
            { person_id: personCard.person_id },
        );

        return result;
    }

    async toggle_card_archived(card, responsibleId) {
        const result = await this.DBM.ExecuteJsonSP("ToggleCardArchived",
            { card_id: card.id },
            { responsible_id: responsibleId },
        );
        return result;
    }

    async save_card_step(cardId, stepId, responsibleId) {
        const result = await this.DBM.ExecuteJsonSP("SaveCardStep",
            { card_id: cardId },
            { step_id: stepId },
            { responsible_id: responsibleId },
        );
        return result;
    }

    async save_card_order(cardId, order) {
        return await this.DBM.ExecuteJsonSP("SaveCardOrder",
            { card_id: cardId },
            { order }
        );
    }

    async save_card_comment(card, commentary, commentaryType, responsibleId) {
        return await this.DBM.ExecuteJsonSP("SaveCardCommentary",
            { card_id : card.id},
            { commentary},
            { commentary_type : commentaryType },
            {responsible_id: responsibleId}
        );
    }
}
