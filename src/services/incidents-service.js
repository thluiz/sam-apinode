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
const Incident_1 = require("../entity/Incident");
const IncidentType_1 = require("../entity/IncidentType");
const Person_1 = require("../entity/Person");
const PersonIncident_1 = require("../entity/PersonIncident");
const cache_decorator_1 = require("../decorators/cache-decorator");
const firebase_emitter_decorator_1 = require("../decorators/firebase-emitter-decorator");
const trylog_decorator_1 = require("../decorators/trylog-decorator");
const errors_codes_1 = require("../helpers/errors-codes");
const result_1 = require("../helpers/result");
const ownership_closing_report_1 = require("./reports/ownership-closing-report");
const base_service_1 = require("./base-service");
const configurations_services_1 = require("./configurations-services");
exports.EVENTS_COLLECTION = "incident-events";
exports.INCIDENT_ADDED = "INCIDENT_ADDED";
exports.INCIDENT_STARTED = "INCIDENT_STARTED";
exports.INCIDENT_CHANGED = "INCIDENT_CHANGED";
exports.INCIDENT_TREATED = "INCIDENT_TREATED";
exports.INCIDENT_ENDED = "INCIDENT_ENDED";
exports.INCIDENT_CANCELLED = "INCIDENT_CANCELLED";
exports.INCIDENT_RESCHEDULED = "INCIDENT_RESCHEDULED";
exports.INCIDENT_COMMENT_ADDED = "INCIDENT_COMMENT_ADDED";
exports.INCIDENT_COMMENT_ARCHIVED = "INCIDENT_COMMENT_ARCHIVED";
exports.INCIDENT_ACTION_ADDED = "INCIDENT_ACTION_ADDED";
exports.INCIDENT_ACTION_COMMENT_ADDED = "INCIDENT_ACTION_COMMENT_ADDED";
exports.INCIDENT_ACTION_CHANGED = "INCIDENT_ACTION_CHANGED";
exports.INCIDENT_ACTION_TREATED = "INCIDENT_ACTION_TREATED";
exports.OWNERSHIP_MIGRATED = "OWNERSHIP_MIGRATED";
exports.OWNERSHIP_LENGTH_CHANGED = "OWNERSHIP_LENGTH_CHANGED";
exports.OWNERSHIP_CHANGED = "OWNERSHIP_CHANGED";
exports.OWNERSHIP_TEAM_CHANGED = "OWNERSHIP_TEAM_CHANGED";
exports.OWNERSHIP_SCHEDULED = "OWNERSHIP_SCHEDULED";
var IncidentErrors;
(function (IncidentErrors) {
    IncidentErrors[IncidentErrors["MissingResponsible"] = 0] = "MissingResponsible";
    IncidentErrors[IncidentErrors["MissingOwnership"] = 1] = "MissingOwnership";
    IncidentErrors[IncidentErrors["MissingOwnerOrSupport"] = 2] = "MissingOwnerOrSupport";
    IncidentErrors[IncidentErrors["ValueNeeded"] = 3] = "ValueNeeded";
    IncidentErrors[IncidentErrors["PaymentMethodNeeded"] = 4] = "PaymentMethodNeeded";
    IncidentErrors[IncidentErrors["TitleNeeded"] = 5] = "TitleNeeded";
})(IncidentErrors = exports.IncidentErrors || (exports.IncidentErrors = {}));
var AddToOwnership;
(function (AddToOwnership) {
    AddToOwnership[AddToOwnership["DoNotAddToOwnership"] = 0] = "DoNotAddToOwnership";
    AddToOwnership[AddToOwnership["AddToNewOwnership"] = 1] = "AddToNewOwnership";
    AddToOwnership[AddToOwnership["AddToExistingOwnership"] = 2] = "AddToExistingOwnership";
})(AddToOwnership = exports.AddToOwnership || (exports.AddToOwnership = {}));
class IncidentsService extends base_service_1.BaseService {
    scheduleOwnership(ownership) {
        return __awaiter(this, void 0, void 0, function* () {
            const execution = yield this.databaseManager
                .ExecuteTypedJsonSP(exports.OWNERSHIP_SCHEDULED, "ScheduleOwnership", []);
            return execution;
        });
    }
    migrateOwnership(ownership, incidents) {
        return __awaiter(this, void 0, void 0, function* () {
            const execution = yield this.databaseManager
                .ExecuteTypedJsonSP(exports.OWNERSHIP_MIGRATED, "MigrateOwnership", [{ ownership_id: ownership.id },
                { location_id: ownership.location_id
                        || ownership.location.id },
                { date: ownership.date },
                { end_date: ownership.end_date },
                { description: ownership.description },
                { incidents_list: incidents.map(i => i.id).join(",") }]);
            return execution;
        });
    }
    addAction(action, responsibleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const execution = yield this.databaseManager
                .ExecuteTypedJsonSP(exports.INCIDENT_ACTION_ADDED, "AddIncidentAction", [{ incident_id: action.incident_id },
                { title: action.title },
                { description: action.description },
                { responsible_id: responsibleId }]);
            return execution;
        });
    }
    completeAction(action, responsibleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const execution = yield this.databaseManager
                .ExecuteTypedJsonSP(exports.INCIDENT_ACTION_CHANGED, "CompleteIncidentAction", [{ action_id: action.id },
                { responsible_id: responsibleId }]);
            return execution;
        });
    }
    ChangeOwnership(ownershipId, ownerId, firstSurrogateId, secondSurrogateId, description, responsibleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const execution = yield this.databaseManager
                .ExecuteTypedJsonSP(exports.OWNERSHIP_TEAM_CHANGED, "changeOwnership", [{ ownership_id: ownershipId },
                { owner_id: ownerId },
                { first_surrogate_id: firstSurrogateId },
                { second_surrogate_id: secondSurrogateId },
                { description },
                { responsible_id: responsibleId }]);
            return execution;
        });
    }
    ChangeOwnershipLength(ownershipId, startDate, endDate, responsibleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const execution = yield this.databaseManager
                .ExecuteTypedJsonSP(exports.OWNERSHIP_LENGTH_CHANGED, "changeOwnershipLength", [{ ownership_id: ownershipId },
                { start_date: startDate },
                { end_date: endDate },
                { responsible_id: responsibleId }]);
            return execution;
        });
    }
    treatAction(actionTreatmentData) {
        return __awaiter(this, void 0, void 0, function* () {
            const execution = yield this.databaseManager
                .ExecuteTypedJsonSP(exports.INCIDENT_ACTION_TREATED, "TreatIncidentAction", [
                { action_id: actionTreatmentData.action_id },
                { incident_id: actionTreatmentData.incident_id },
                { treatment_type: actionTreatmentData.treatment_type },
                { treatment_description: actionTreatmentData.treatment_description },
                { treatment_date: actionTreatmentData.treatment_date },
                { responsible_id: actionTreatmentData.responsible_id }
            ]);
            return execution;
        });
    }
    start_incident(incident, responsibleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const validationResult = yield this.databaseManager
                .ExecuteJsonSP("ValidateStartIncident", { incident: incident.id });
            if (!validationResult.success) {
                return validationResult;
            }
            if (!validationResult.data[0].success) {
                return validationResult.data[0];
            }
            const execution = yield this.databaseManager
                .ExecuteTypedJsonSP(exports.INCIDENT_STARTED, "StartIncident", [{ incident: incident.id },
                { responsible_id: responsibleId }]);
            this.clearCurrentActivitiesCache();
            return execution;
        });
    }
    reopen_incident(incident, responsibleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const execution = yield this.databaseManager
                .ExecuteTypedJsonSP(exports.INCIDENT_STARTED, "ReopenIncident", [{ incident: incident.id },
                { responsible_id: responsibleId }]);
            this.clearCurrentActivitiesCache();
            return execution;
        });
    }
    cancel_start_incident(incident, responsibleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const execution = yield this.databaseManager
                .ExecuteTypedJsonSP(exports.INCIDENT_CHANGED, "CancelIncidentStart", [{ incident: incident.id },
                { responsible_id: responsibleId }]);
            this.clearCurrentActivitiesCache();
            return execution;
        });
    }
    close_incident(incident, responsible) {
        return __awaiter(this, void 0, void 0, function* () {
            const validationResult = yield this.databaseManager.ExecuteJsonSP("ValidateCloseIncident", { incident: incident.id });
            if (!validationResult.success) {
                return validationResult;
            }
            if (!validationResult.data[0].success) {
                return validationResult.data[0];
            }
            const execution = yield this.databaseManager.ExecuteTypedJsonSP(exports.INCIDENT_ENDED, "CloseIncident", [{ incident: incident.id },
                { close_description: incident.close_text || "" },
                { title: incident.title || "" },
                { responsible_id: responsible.id },
                { fund_value: incident.fund_value || null },
                { payment_method_id: incident.payment_method_id > 0 ?
                        incident.payment_method_id : null }]);
            this.clearCurrentActivitiesCache();
            return execution;
        });
    }
    close_incident_and_send_ownership_report(incident, responsible) {
        return __awaiter(this, void 0, void 0, function* () {
            const closing = yield this.close_incident(incident, responsible);
            if (closing.success && incident.type.id === configurations_services_1.Constants.IncidentTypeOwnership) {
                yield new ownership_closing_report_1.OwnershipClosingReport().send(incident);
            }
            this.clearCurrentActivitiesCache();
            return closing;
        });
    }
    remove_incident(incident, responsibleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const execution = yield this.databaseManager.ExecuteTypedJsonSP(exports.INCIDENT_CANCELLED, "RemoveIncident", [{ incident: incident.id },
                { responsible_id: responsibleId }]);
            this.clearCurrentActivitiesCache();
            return execution;
        });
    }
    create_people_incidents(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const incidents = [];
            let ownership;
            if (data.addToOwnership === AddToOwnership.AddToNewOwnership) {
                const ownershipData = Object.assign({
                    new_owner: data.new_owner,
                    new_support: data.new_support
                }, data);
                const ownershipRegister = yield this.create_ownership(ownershipData);
                if (!ownershipRegister.success) {
                    return ownershipRegister;
                }
                const ownershipAndSupport = ownershipRegister.data;
                ownership = ownershipAndSupport.ownership;
                incidents.push(ownership);
                incidents.push(ownershipAndSupport.support);
            }
            for (const person of data.people) {
                const incidentData = Object.assign({ person }, data);
                if (data.addToOwnership === AddToOwnership.AddToNewOwnership) {
                    incidentData.ownership = ownership;
                }
                const incidentRegister = yield this.create_incident_for_person(incidentData);
                if (!incidentRegister.success) {
                    return incidentRegister;
                }
                incidents.push(incidentRegister.data);
            }
            return result_1.SuccessResult.Ok(exports.INCIDENT_ADDED, incidents);
        });
    }
    create_incident_for_person(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.responsible) {
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.ValidationError, new Error(IncidentErrors[IncidentErrors.MissingResponsible]));
            }
            if (data.incident.type.require_ownership && !data.ownership) {
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.ValidationError, new Error(IncidentErrors[IncidentErrors.MissingOwnership]));
            }
            const incident = data.incident;
            if (data.start_activity) {
                incident.started_by = data.responsible;
                incident.started_on = new Date();
            }
            if (data.register_closed || data.register_treated) {
                incident.closed_by = data.responsible;
                incident.closed_on = new Date();
                incident.closed = true;
            }
            if (data.register_treated) {
                incident.treated = true;
            }
            if (incident.type.need_value
                && incident.value <= 0) {
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.ValidationError, new Error(IncidentErrors[IncidentErrors.ValueNeeded]));
            }
            if (incident.type.require_title
                && (incident.title || "").length <= 0) {
                const error = new Error(IncidentErrors[IncidentErrors.TitleNeeded]);
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.ValidationError, error);
            }
            if (incident.type.require_payment_method
                && incident.payment_method_id <= 0) {
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.ValidationError, new Error(IncidentErrors[IncidentErrors.PaymentMethodNeeded]));
            }
            incident.ownership = data.ownership;
            incident.people_incidents = [PersonIncident_1.PersonIncident.create(incident, data.person)];
            yield this.save(incident);
            return result_1.SuccessResult.Ok(exports.INCIDENT_ADDED, incident);
        });
    }
    create_ownership(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.new_owner || !data.new_support) {
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.ValidationError, new Error(IncidentErrors[IncidentErrors.MissingOwnerOrSupport]));
            }
            const ownershipData = Incident_1.Incident.duplicate(data.incident);
            ownershipData.type = (yield (yield this.getRepository(IncidentType_1.IncidentType))
                .findOne(configurations_services_1.Constants.IncidentTypeOwnership));
            if (data.incident.type.need_fund_value) {
                ownershipData.define_fund_value = true;
            }
            const ownershipResult = yield this.create_incident_for_person({
                incident: ownershipData,
                person: data.new_owner,
                register_closed: data.register_closed,
                register_treated: data.register_treated,
                start_activity: data.start_activity,
                responsible: data.responsible
            });
            if (!ownershipResult.success) {
                return ownershipResult;
            }
            const ownership = ownershipResult.data;
            const supportData = Incident_1.Incident.duplicate(data.incident);
            supportData.type = (yield (yield this.getRepository(IncidentType_1.IncidentType))
                .findOne(configurations_services_1.Constants.IncidentTypeSupport));
            const supportResult = yield this.create_incident_for_person({
                incident: supportData,
                person: data.new_support,
                register_closed: data.register_closed,
                register_treated: data.register_treated,
                start_activity: data.start_activity,
                responsible: data.responsible,
                ownership
            });
            if (!supportResult.success) {
                return supportResult;
            }
            const support = supportResult.data;
            return result_1.SuccessResult.Ok(exports.INCIDENT_ADDED, { ownership, support });
        });
    }
    register_incident(incident, responsibleId) {
        return __awaiter(this, void 0, void 0, function* () {
            let date = incident.date;
            if (incident.date && incident.date.year) {
                date = `${incident.date.year}-${incident.date.month}-${incident.date.day}`;
            }
            if (incident.time) {
                date += ` ${incident.time.hour}:${incident.time.minute}`;
            }
            const execution = yield this.databaseManager
                .ExecuteTypedJsonSP(exports.INCIDENT_ADDED, "RegisterNewIncident", [{ description: incident.description },
                { responsible_id: responsibleId },
                { people: incident.people.filter((f) => f.person_id > 0)
                        .map((p) => p.person_id).join(",") },
                { date },
                { type: incident.type.id },
                { branch: incident.branch_id },
                { title: incident.title },
                { value: incident.value },
                { start_activity: incident.start_activity ? 1 : 0 },
                { register_closed: incident.close_activity === 1 ? 1 : 0 },
                { register_treated: incident.close_activity === 2 ? 1 : 0 },
                { new_people: incident.people.filter((f) => f.person_id === 0)
                        .map((p) => p.name.trim()).join(",") },
                { add_to_ownernership: incident.add_to_ownernership },
                { new_owner_id: incident.new_owner_id },
                { new_support_id: incident.new_support_id },
                { ownership_id: incident.ownership ? incident.ownership.id : null },
                { location_id: incident.location ? incident.location.id : null }]);
            return execution;
        });
    }
    get_comments(incidentId, showArchived) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.databaseManager
                .ExecuteJsonSP("GetIncidentComments", { incident_id: incidentId }, { show_archived: showArchived });
            return result;
        });
    }
    reschedule_incident(incident, newIncident, contact, responsibleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const execution = yield this.databaseManager.ExecuteTypedJsonSP(exports.INCIDENT_RESCHEDULED, "RescheduleIncident", [{ incident: incident.id },
                { contact },
                { new_date: newIncident.date + " " + newIncident.start_hour },
                { responsible_id: responsibleId }]);
            return execution;
        });
    }
    register_contact_for_incident(incident, contact, responsibleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const execution = yield this.databaseManager.ExecuteTypedJsonSP(exports.INCIDENT_TREATED, "RegisterContactForIncident", [{ incident: incident.id },
                { contact },
                { responsible_id: responsibleId }]);
            return execution;
        });
    }
    save_comment(incidentId, comment, responsibleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.databaseManager
                .ExecuteTypedJsonSP(exports.INCIDENT_COMMENT_ADDED, "SaveIncidentComment", [{ incident_id: incidentId }, { comment }, { responsible_id: responsibleId }]);
        });
    }
    save_action_comment(incidentActionId, comment, responsibleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.databaseManager
                .ExecuteTypedJsonSP(exports.INCIDENT_ACTION_COMMENT_ADDED, "SaveIncidentActionComment", [{ incident_action_id: incidentActionId },
                { comment },
                { responsible_id: responsibleId }]);
        });
    }
    archive_comment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.databaseManager
                .ExecuteTypedJsonSP(exports.INCIDENT_COMMENT_ARCHIVED, "TogleIncidentCommentArchived", [{ comment_id: commentId }]);
        });
    }
    clearCurrentActivitiesCache() {
        cache_decorator_1.refreshMethodCache("getCurrentActivities");
    }
}
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "scheduleOwnership", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "migrateOwnership", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "addAction", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "completeAction", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number, String, Number]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "ChangeOwnership", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Number]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "ChangeOwnershipLength", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "treatAction", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "start_incident", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "reopen_incident", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "cancel_start_incident", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Incident_1.Incident, Person_1.Person]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "close_incident", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Incident_1.Incident, Person_1.Person]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "close_incident_and_send_ownership_report", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "remove_incident", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "create_people_incidents", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "register_incident", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "get_comments", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "reschedule_incident", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "register_contact_for_incident", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "save_comment", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "save_action_comment", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "archive_comment", null);
exports.IncidentsService = IncidentsService;
//# sourceMappingURL=incidents-service.js.map