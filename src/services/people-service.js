"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_service_1 = require("./base-service");
const errors_codes_1 = require("../helpers/errors-codes");
const result_1 = require("../helpers/result");
const Person_1 = require("../entity/Person");
const Role_1 = require("../entity/Role");
const firebase_emitter_decorator_1 = require("../decorators/firebase-emitter-decorator");
const trylog_decorator_1 = require("../decorators/trylog-decorator");
exports.PEOPLE_COLLECTION = "people-events";
exports.PERSON_ADDED = "PERSON_ADDED";
exports.PERSON_UPDATED_ACTION = "PERSON_UPDATED_ACTION";
exports.PERSON_CHANGED = "PERSON_CHANGED";
class PeopleService extends base_service_1.BaseService {
    create_person(name, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const RR = yield this.getRepository(Role_1.Role);
            const person = new Person_1.Person();
            person.name = name;
            person.is_interested = roleId === 4;
            person.roles = [(yield RR.findOne(roleId))];
            yield this.save(person);
            return result_1.SuccessResult.Ok(exports.PERSON_ADDED, person);
        });
    }
    create_person_from_voucher(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield this.databaseManager).ExecuteSPNoResults("CreatePersonFromVoucher", { name: data.name }, { email: data.email }, { cpf: data.cpf }, { phone: data.phone }, { socialLinks: data.socialLinks }, { branch_id: data.branch_id }, { voucher_id: data.voucher_id }, { additionalAnswer: data.additionalAnswer }, { invite_key: data.invite_key }, { branch_map_id: data.branch_map_id });
        });
    }
    save_avatar_image(personId, blobImage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const PR = yield (yield this.databaseManager)
                    .getRepository(Person_1.Person);
                const person = yield PR.findOne({ id: personId });
                person.avatar_img = blobImage;
                person.avatar_md = false;
                person.avatar_sm = false;
                person.avatar_esm = false;
                yield PR.save(person);
                return result_1.SuccessResult.GeneralOk(person);
            }
            catch (error) {
                // TODO: Remove file from blob
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        });
    }
    pin_comment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.databaseManager
                .ExecuteTypedJsonSP(exports.PERSON_UPDATED_ACTION, "ToglePersonCommentPinned", [{ commentId }]);
            return result;
        });
    }
    save_address(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.databaseManager.ExecuteSPNoResults(`SaveAddress`, { person_id: address.person_id }, { country_id: address.country_id }, { postal_code: address.postal_code }, { street: address.street }, { district: address.district }, { city: address.city }, { state: address.state }, { number: address.number }, { complement: address.complement });
        });
    }
    archive_address(personAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.databaseManager.ExecuteSPNoResults(`ArchiveAddress`, { address_id: personAddress.address_id });
        });
    }
    add_role(personId, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.databaseManager.ExecuteSPNoResults(`AddPersonRole`, { person_id: personId }, { role_id: roleId });
        });
    }
    remove_role(personId, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.databaseManager.ExecuteSPNoResults(`RemovePersonRole`, { person_id: personId }, { role_id: roleId });
        });
    }
    change_kf_name(personId, kfName, ideograms) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.databaseManager.ExecuteSPNoResults(`AddAlias`, { person_id: personId }, { alias: kfName }, { ideograms });
        });
    }
    update_person_data(person) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.databaseManager.ExecuteTypedJsonSP("PERSON_CHANGED", `UpdatePersonData`, [{ id: person.id },
                { name: person.full_name || person.name },
                { birth_date: person.birth_date },
                { admission_date: person.admission_date },
                { enrollment_date: person.enrollment_date },
                { baaisi_date: person.baaisi_date },
                { passport_expiration_date: person.passport_expiration_date },
                { kf_name: person.kf_name },
                { identification: person.identification },
                { identification2: person.identification2 },
                { passport: person.passport },
                { occupation: person.occupation },
                { kf_name_ideograms: person.kf_name_ideograms },
                { gender: person.gender },
                { shirt_size: person.shirt_size },
                { pants_size: person.pants_size },
                { family_id: person.family_id > 0 ? person.family_id : null },
                { destiny_family_id: person.destiny_family_id > 0 ? person.destiny_family_id : null },
                { branch_id: person.branch_id > 0 ? person.branch_id : null },
                { domain_id: person.domain_id > 0 ? person.domain_id : null },
                { program_id: person.program_id > 0 ? person.program_id : null },
                { alias: person.alias }]);
        });
    }
    register_new_person(person, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.databaseManager.ExecuteSPNoResults(`RegisterNewPerson`, { role_id: person.role_id > 0 ? person.role_id : null }, { name: person.name }, { branch_id: person.branch_id > 0 ? person.branch_id : null }, { birth_date: person.birth_date }, { identification: person.identification }, { identification2: person.identification2 }, { occupation: person.occupation }, { next_incident_type: person.next_incident_type > 0 ? person.next_incident_type : null }, { next_incident_date: person.next_incident_date && person.next_incident_date.length > 10 ?
                    person.next_incident_date : null
            }, { next_incident_description: person.next_incident_description }, { initial_contact: person.initial_contact }, { comment: person.comment }, { user_id: user.id });
        });
    }
    remove_schedule(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.databaseManager.ExecuteSPNoResults(`CancelPersonSchedule`, { person_schedule_id: id });
        });
    }
    save_schedule(schedule, responsibleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.databaseManager.ExecuteSPNoResults(`SavePersonScheduleAndGenerateIncidents`, { person_id: schedule.person_id }, { branch_id: schedule.branch_id }, { location_id: schedule.location_id }, { incident_type: schedule.incident_type }, { recurrence_type: schedule.recurrence_type }, { start_date: schedule.start_date }, { start_hour: schedule.start_hour }, { start_minute: schedule.start_minute }, { end_date: schedule.end_date }, { end_hour: schedule.end_hour }, { end_minute: schedule.end_minute }, { number_of_incidents: schedule.number_of_incidents }, { description: schedule.description }, { value: schedule.value }, { responsible_id: responsibleId });
        });
    }
    remove_contact(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.databaseManager.ExecuteSPNoResults(`RemovePersonContact`, { contact_id: id });
        });
    }
    save_contact(contactData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.databaseManager.ExecuteSPNoResults(`SavePersonContact`, { person_id: contactData.person_id }, { contact_type: contactData.contact_type }, { contact: contactData.contact }, { details: contactData.details }, { principal: contactData.principal });
        });
    }
    save_comment_about(personId, comment, responsibleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.databaseManager.ExecuteSPNoResults(`SavePersonComment`, { person_id: personId }, { comment }, { responsible_id: responsibleId });
        });
    }
    archive_comment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.databaseManager.ExecuteSPNoResults(`ToglePersonCommentArchived`, { comment_id: commentId });
        });
    }
}
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.PEOPLE_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], PeopleService.prototype, "create_person", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PeopleService.prototype, "create_person_from_voucher", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PeopleService.prototype, "save_avatar_image", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PeopleService.prototype, "pin_comment", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PeopleService.prototype, "save_address", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PeopleService.prototype, "archive_address", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PeopleService.prototype, "add_role", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PeopleService.prototype, "remove_role", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PeopleService.prototype, "change_kf_name", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.PEOPLE_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PeopleService.prototype, "update_person_data", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.PEOPLE_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PeopleService.prototype, "register_new_person", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PeopleService.prototype, "remove_schedule", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.PEOPLE_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PeopleService.prototype, "save_schedule", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PeopleService.prototype, "remove_contact", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PeopleService.prototype, "save_contact", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PeopleService.prototype, "save_comment_about", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PeopleService.prototype, "archive_comment", null);
exports.PeopleService = PeopleService;
//# sourceMappingURL=people-service.js.map