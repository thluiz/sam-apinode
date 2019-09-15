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
const database_manager_1 = require("./managers/database-manager");
const dependency_manager_1 = require("./managers/dependency-manager");
class CardsService {
    constructor() {
        this.DBM = dependency_manager_1.DependencyManager.container.resolve(database_manager_1.DatabaseManager);
    }
    correct_card_out_of_parent_step() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.DBM.ExecuteSPNoResults("CorrectCardOutOfParentStep");
        });
    }
    moveCard(card, responsible) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.DBM.ExecuteJsonSP("MoveCard", { card_id: card.card_id }, { parent_id: card.parent_id }, { step_id: card.step_id }, { responsible_id: yield responsible.getPersonId() });
            if (!result.success) {
                return result;
            }
        });
    }
    save_card(card, responsibleId) {
        return __awaiter(this, void 0, void 0, function* () {
            let date = card.due_date ? `${card.due_date.year}-${card.due_date.month}-${card.due_date.day}` : null;
            if (date != null && card.due_time) {
                date += ` ${card.due_time.hour}:${card.due_time.minute}`;
            }
            if (card.id && card.id > 0) {
                return yield this.DBM.ExecuteJsonSP("UpdateCard", { card_id: card.id }, { title: card.title }, { due_date: date }, { description: card.description }, { location_id: card.locations != null && card.locations[0] ? card.locations[0].id : 1 }, { leader_id: card.leaders != null && card.leaders[0] ?
                        card.leaders[0].id : (card.leaders.person_id || card.leaders.id) }, { abrev: card.abrev }, { responsible_id: responsibleId });
            }
            const result = yield this.DBM.ExecuteJsonSP("SaveCard", { title: card.title }, { parent_id: card.parent.id }, { due_date: date }, { description: card.description }, { location_id: card.locations != null && card.locations[0] ? card.locations[0].id : 1 }, { card_template_id: card.template ? card.template.id : 3 }, { leader_id: card.leaders.person_id || card.leaders.id }, { people: card.people ?
                    card.people
                        .filter((f) => f.person_id > 0)
                        .map((p) => p.person_id).join(",")
                    : null
            }, { new_people: card.people ?
                    card.people
                        .filter((f) => f.person_id === 0)
                        .map((p) => p.name.trim())
                        .join(",")
                    : null
            }, { abrev: card.abrev }, { group_id: card.group ? card.group.id : null }, { branch_id: card.branch ? card.branch.id : null }, { responsible_id: responsibleId });
            return result;
        });
    }
    save_person_card(personCard) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.DBM.ExecuteSPNoResults("SavePersonCard", { card_id: personCard.card_id }, { person_id: personCard.person_id }, { position_id: personCard.position_id || 4 }, { position_description: personCard.position_description }, { order: personCard.order || -1 });
            return result;
        });
    }
    remove_person_card(personCard) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.DBM.ExecuteSPNoResults("RemovePersonCard", { card_id: personCard.card_id }, { person_id: personCard.person_id });
            return result;
        });
    }
    toggle_card_archived(card, responsibleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.DBM.ExecuteJsonSP("ToggleCardArchived", { card_id: card.id }, { responsible_id: responsibleId });
            return result;
        });
    }
    save_card_step(cardId, stepId, responsibleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.DBM.ExecuteJsonSP("SaveCardStep", { card_id: cardId }, { step_id: stepId }, { responsible_id: responsibleId });
            return result;
        });
    }
    save_card_order(cardId, order) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.DBM.ExecuteJsonSP("SaveCardOrder", { card_id: cardId }, { order });
        });
    }
    save_card_comment(card, commentary, commentaryType, responsibleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.DBM.ExecuteJsonSP("SaveCardCommentary", { card_id: card.id }, { commentary }, { commentary_type: commentaryType }, { responsible_id: responsibleId });
        });
    }
}
exports.CardsService = CardsService;
//# sourceMappingURL=cards-service.js.map