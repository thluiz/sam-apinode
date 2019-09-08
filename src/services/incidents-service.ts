import { Incident } from "../entity/Incident";
import { IncidentType } from "../entity/IncidentType";
import { Person } from "../entity/Person";
import { PersonIncident } from "../entity/PersonIncident";

import { refreshMethodCache } from "../decorators/cache-decorator";
import { firebaseEmitter } from "../decorators/firebase-emitter-decorator";
import { tryLogAsync } from "../decorators/trylog-decorator";

import { ErrorCode } from "../helpers/errors-codes";
import { ErrorResult, Result, SuccessResult } from "../helpers/result";

import { OwnershipClosingReport } from "./reports/ownership-closing-report";

import { BaseService } from "./base-service";
import { Constants } from "./configurations-services";

export const EVENTS_COLLECTION = "incident-events";
export const INCIDENT_ADDED = "INCIDENT_ADDED";
export const INCIDENT_STARTED = "INCIDENT_STARTED";
export const INCIDENT_CHANGED = "INCIDENT_CHANGED";
export const INCIDENT_TREATED = "INCIDENT_TREATED";
export const INCIDENT_ENDED = "INCIDENT_ENDED";
export const INCIDENT_CANCELLED = "INCIDENT_CANCELLED";
export const INCIDENT_RESCHEDULED = "INCIDENT_RESCHEDULED";
export const INCIDENT_COMMENT_ADDED = "INCIDENT_COMMENT_ADDED";
export const INCIDENT_COMMENT_ARCHIVED = "INCIDENT_COMMENT_ARCHIVED";

export const INCIDENT_ACTION_ADDED = "INCIDENT_ACTION_ADDED";
export const INCIDENT_ACTION_COMMENT_ADDED = "INCIDENT_ACTION_COMMENT_ADDED";
export const INCIDENT_ACTION_CHANGED = "INCIDENT_ACTION_CHANGED";
export const INCIDENT_ACTION_TREATED = "INCIDENT_ACTION_TREATED";

export const OWNERSHIP_MIGRATED = "OWNERSHIP_MIGRATED";
export const OWNERSHIP_LENGTH_CHANGED = "OWNERSHIP_LENGTH_CHANGED";
export const OWNERSHIP_CHANGED = "OWNERSHIP_CHANGED";
export const OWNERSHIP_TEAM_CHANGED = "OWNERSHIP_TEAM_CHANGED";
export const OWNERSHIP_SCHEDULED = "OWNERSHIP_SCHEDULED";

export interface IRegisterIncident {
    incident: Incident;
    responsible: Person;
    start_activity: boolean;
    register_closed: boolean;
    register_treated: boolean;
    people: Person[];
    new_owner?: Person;
    new_support?: Person;
    addToOwnership: AddToOwnership;
    ownership?: Incident;
}

export interface IRegisterPersonIncident {
    incident: Incident;
    responsible: Person;
    start_activity: boolean;
    register_closed: boolean;
    register_treated: boolean;
    person: Person;
    ownership?: Incident;
}

export interface IRegisterOwnership {
    incident: Incident;
    responsible: Person;
    start_activity: boolean;
    register_closed: boolean;
    register_treated: boolean;
    new_owner: Person;
    new_support: Person;
}

export interface IActionTreatmentCommand {
    action_id: number;
    incident_id: number;
    treatment_type: number;
    treatment_description: string;
    treatment_date: string;
    responsible_id: number;
}

export enum IncidentErrors {
    MissingResponsible,
    MissingOwnership,
    MissingOwnerOrSupport,
    ValueNeeded,
    PaymentMethodNeeded,
    TitleNeeded
}

export interface IOwnershipWithSupport {
    ownership: Incident;
    support: Incident;
}

export enum AddToOwnership {
    DoNotAddToOwnership,
    AddToNewOwnership,
    AddToExistingOwnership
}

export interface IMigrateOwnershipData {
    id: number; date: string;
    end_date: string;
    location_id: number;
    description: string;
}

export class IncidentsService extends BaseService {

    @tryLogAsync()
    @firebaseEmitter(EVENTS_COLLECTION)
    async scheduleOwnership(ownership) {

        const execution = await this.databaseManager
            .ExecuteTypedJsonSP(OWNERSHIP_SCHEDULED,
                "ScheduleOwnership",
                []
            );

        return execution;
    }

    @tryLogAsync()
    @firebaseEmitter(EVENTS_COLLECTION)
    async migrateOwnership(ownership: Incident | IMigrateOwnershipData,
                           incidents: Array<{ id: number }>) {

        const execution = await this.databaseManager
            .ExecuteTypedJsonSP(OWNERSHIP_MIGRATED,
                "MigrateOwnership",
                [{ ownership_id: ownership.id },
                { location_id:  (ownership as IMigrateOwnershipData).location_id
                                || (ownership as Incident).location.id },
                { date: ownership.date },
                { end_date: ownership.end_date },
                { description: ownership.description },
                { incidents_list: incidents.map(i => i.id).join(",")} ]
            );

        return execution;
    }

    @tryLogAsync()
    @firebaseEmitter(EVENTS_COLLECTION)
    async addAction(action, responsibleId): Promise<Result> {
        const execution = await this.databaseManager
            .ExecuteTypedJsonSP(INCIDENT_ACTION_ADDED,
                "AddIncidentAction",
                [{ incident_id: action.incident_id },
                 {title: action.title},
                 {description: action.description},
                { responsible_id: responsibleId }]
            );

        return execution;
    }

    @tryLogAsync()
    @firebaseEmitter(EVENTS_COLLECTION)
    async completeAction(action, responsibleId): Promise<Result> {
        const execution = await this.databaseManager
            .ExecuteTypedJsonSP(INCIDENT_ACTION_CHANGED,
                "CompleteIncidentAction",
                [{ action_id: action.id },
                 {responsible_id: responsibleId }]
            );

        return execution;
    }

    @tryLogAsync()
    @firebaseEmitter(EVENTS_COLLECTION)
    async ChangeOwnership(ownershipId: number,
                          ownerId: number, firstSurrogateId: number,
                          secondSurrogateId: number, description: string,
                          responsibleId: number ): Promise<Result> {

        const execution = await this.databaseManager
            .ExecuteTypedJsonSP(OWNERSHIP_TEAM_CHANGED,
                "changeOwnership",
                [{ ownership_id: ownershipId },
                 { owner_id: ownerId },
                 { first_surrogate_id: firstSurrogateId },
                 { second_surrogate_id: secondSurrogateId },
                 { description },
                 { responsible_id: responsibleId }]
            );

        return execution;
    }

    @tryLogAsync()
    @firebaseEmitter(EVENTS_COLLECTION)
    async ChangeOwnershipLength(ownershipId: number,
                                startDate: string, endDate: string,
                                responsibleId: number): Promise<Result> {

        const execution = await this.databaseManager
            .ExecuteTypedJsonSP(OWNERSHIP_LENGTH_CHANGED,
                "changeOwnershipLength",
                [{ ownership_id: ownershipId },
                 {start_date: startDate },
                 {end_date: endDate },
                 {responsible_id: responsibleId }]
            );

        return execution;
    }

    @tryLogAsync()
    @firebaseEmitter(EVENTS_COLLECTION)
    async treatAction(actionTreatmentData: IActionTreatmentCommand ): Promise<Result> {
        const execution = await this.databaseManager
            .ExecuteTypedJsonSP(INCIDENT_ACTION_TREATED,
                "TreatIncidentAction", [
                    { action_id: actionTreatmentData.action_id },
                    { incident_id: actionTreatmentData.incident_id },
                    { treatment_type: actionTreatmentData.treatment_type },
                    { treatment_description: actionTreatmentData.treatment_description },
                    { treatment_date: actionTreatmentData.treatment_date },
                    { responsible_id: actionTreatmentData.responsible_id }
                ]
            );

        return execution;
    }

    @tryLogAsync()
    @firebaseEmitter(EVENTS_COLLECTION)
    async start_incident(incident, responsibleId): Promise<Result> {
        const validationResult = await this.databaseManager
            .ExecuteJsonSP<any>("ValidateStartIncident",
                { incident: incident.id }
            );

        if (!validationResult.success) {
            return validationResult;
        }

        if (!validationResult.data[0].success) {
            return validationResult.data[0];
        }

        const execution = await this.databaseManager
            .ExecuteTypedJsonSP(INCIDENT_STARTED,
                "StartIncident",
                [{ incident: incident.id },
                { responsible_id: responsibleId }]
            );

        this.clearCurrentActivitiesCache();
        return execution;
    }

    @tryLogAsync()
    @firebaseEmitter(EVENTS_COLLECTION)
    async reopen_incident(incident, responsibleId): Promise<Result> {
        const execution = await this.databaseManager
        .ExecuteTypedJsonSP(
            INCIDENT_STARTED,
            "ReopenIncident",
            [{ incident: incident.id },
            { responsible_id: responsibleId }]
        );

        this.clearCurrentActivitiesCache();
        return execution;
    }

    @tryLogAsync()
    @firebaseEmitter(EVENTS_COLLECTION)
    async cancel_start_incident(incident, responsibleId): Promise<Result> {
        const execution = await this.databaseManager
            .ExecuteTypedJsonSP(
                INCIDENT_CHANGED,
                "CancelIncidentStart",
                [{ incident: incident.id },
                    { responsible_id: responsibleId }]
            );

        this.clearCurrentActivitiesCache();
        return execution;
    }

    @tryLogAsync()
    @firebaseEmitter(EVENTS_COLLECTION)
    async close_incident(incident: Incident, responsible: Person): Promise<Result<Incident>> {
        const validationResult = await this.databaseManager.ExecuteJsonSP<any>(
            "ValidateCloseIncident",
            { incident: incident.id }
        );

        if (!validationResult.success) {
            return validationResult;
        }

        if (!validationResult.data[0].success) {
            return validationResult.data[0];
        }

        const execution = await this.databaseManager.ExecuteTypedJsonSP<Incident>(
            INCIDENT_ENDED,
            "CloseIncident",
            [{ incident: incident.id },
            { close_description: incident.close_text || "" },
            { title: incident.title || "" },
            { responsible_id: responsible.id },
            { fund_value: incident.fund_value || null },
            { payment_method_id: incident.payment_method_id > 0 ?
                                    incident.payment_method_id : null }]);

        this.clearCurrentActivitiesCache();
        return execution;
    }

    @tryLogAsync()
    @firebaseEmitter(EVENTS_COLLECTION)
    async close_incident_and_send_ownership_report(incident: Incident, responsible: Person)
    : Promise<Result<Incident>> {

        const closing = await this.close_incident(incident, responsible);

        if (closing.success && incident.type.id === Constants.IncidentTypeOwnership) {
            await new OwnershipClosingReport().send(incident);
        }

        this.clearCurrentActivitiesCache();
        return closing;
    }

    @tryLogAsync()
    @firebaseEmitter(EVENTS_COLLECTION)
    async remove_incident(incident, responsibleId): Promise<Result> {
        const execution = await this.databaseManager.ExecuteTypedJsonSP(
            INCIDENT_CANCELLED,
            "RemoveIncident",
            [{ incident: incident.id },
            { responsible_id: responsibleId }]
        );

        this.clearCurrentActivitiesCache();
        return execution;
    }

    @tryLogAsync()
    @firebaseEmitter(EVENTS_COLLECTION)
    async create_people_incidents(data: IRegisterIncident): Promise<Result<Incident[]>> {
        const incidents: Incident[] = [];
        let ownership: Incident;

        if (data.addToOwnership === AddToOwnership.AddToNewOwnership) {
            const ownershipData = Object.assign({
                new_owner: data.new_owner,
                new_support: data.new_support
            }, data) as IRegisterOwnership;

            const ownershipRegister = await this.create_ownership(
                ownershipData
            );

            if (!ownershipRegister.success) {
                return ownershipRegister as ErrorResult;
            }

            const ownershipAndSupport = ownershipRegister.data as IOwnershipWithSupport;

            ownership = ownershipAndSupport.ownership;
            incidents.push(ownership);
            incidents.push(ownershipAndSupport.support);
        }

        for (const person of data.people) {
            const incidentData = Object.assign({ person }, data) as IRegisterPersonIncident;
            if (data.addToOwnership === AddToOwnership.AddToNewOwnership) {
                incidentData.ownership = ownership;
            }
            const incidentRegister = await this.create_incident_for_person(incidentData);
            if (!incidentRegister.success) {
                return incidentRegister as ErrorResult;
            }

            incidents.push(incidentRegister.data as Incident);
        }

        return SuccessResult.Ok(INCIDENT_ADDED, incidents);
    }

    async create_incident_for_person(data: IRegisterPersonIncident)
    : Promise<Result<Incident>> {
        if (!data.responsible) {
            return ErrorResult.Fail(ErrorCode.ValidationError,
                new Error(IncidentErrors[IncidentErrors.MissingResponsible])
            );
        }

        if (data.incident.type.require_ownership && !data.ownership) {
            return ErrorResult.Fail(ErrorCode.ValidationError,
                new Error(IncidentErrors[IncidentErrors.MissingOwnership]));
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
            return ErrorResult.Fail(ErrorCode.ValidationError,
                    new Error(IncidentErrors[IncidentErrors.ValueNeeded]));
        }

        if (incident.type.require_title
            && (incident.title || "").length <= 0) {
            const error = new Error(IncidentErrors[IncidentErrors.TitleNeeded]);
            return ErrorResult.Fail(ErrorCode.ValidationError, error);
        }

        if (incident.type.require_payment_method
            && incident.payment_method_id <= 0) {
            return ErrorResult.Fail(ErrorCode.ValidationError,
                    new Error(IncidentErrors[IncidentErrors.PaymentMethodNeeded]));
        }

        incident.ownership = data.ownership;
        incident.people_incidents = [ PersonIncident.create(incident, data.person) ];

        await this.save(incident);

        return SuccessResult.Ok(INCIDENT_ADDED, incident);
    }

    async create_ownership(data: IRegisterOwnership)
    : Promise<Result<IOwnershipWithSupport>> {
        if (!data.new_owner || !data.new_support) {
            return ErrorResult.Fail(
                ErrorCode.ValidationError,
                new Error(IncidentErrors[IncidentErrors.MissingOwnerOrSupport])
            );
        }

        const ownershipData = Incident.duplicate(data.incident);
        ownershipData.type = (await (await this.getRepository(IncidentType))
                                .findOne(Constants.IncidentTypeOwnership));
        if (data.incident.type.need_fund_value) {
            ownershipData.define_fund_value = true;
        }

        const ownershipResult = await this.create_incident_for_person({
                incident: ownershipData,
                person: data.new_owner,
                register_closed: data.register_closed,
                register_treated: data.register_treated,
                start_activity: data.start_activity,
                responsible: data.responsible
            }
        );

        if (!ownershipResult.success) {
            return ownershipResult as ErrorResult;
        }

        const ownership = ownershipResult.data as Incident;
        const supportData = Incident.duplicate(data.incident);
        supportData.type = (await (await this.getRepository(IncidentType))
                                .findOne(Constants.IncidentTypeSupport));

        const supportResult = await this.create_incident_for_person({
                incident: supportData,
                person: data.new_support,
                register_closed: data.register_closed,
                register_treated: data.register_treated,
                start_activity: data.start_activity,
                responsible: data.responsible,
                ownership
            }
        );

        if (!supportResult.success) {
            return supportResult as ErrorResult;
        }
        const support = supportResult.data as Incident;

        return SuccessResult.Ok(INCIDENT_ADDED, { ownership, support });
    }

    @tryLogAsync()
    @firebaseEmitter(EVENTS_COLLECTION)
    async register_incident(incident, responsibleId): Promise<Result> {
        let date = incident.date;

        if (incident.date && incident.date.year) {
            date = `${incident.date.year}-${incident.date.month}-${incident.date.day}`;
        }

        if (incident.time) {
            date += ` ${incident.time.hour}:${incident.time.minute}`;
        }

        const execution = await this.databaseManager
            .ExecuteTypedJsonSP<any[]>(
                INCIDENT_ADDED,
                "RegisterNewIncident",
                [{ description: incident.description },
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
                { add_to_ownernership: incident.add_to_ownernership},
                { new_owner_id: incident.new_owner_id },
                { new_support_id: incident.new_support_id },
                { ownership_id: incident.ownership ? incident.ownership.id : null },
                { location_id: incident.location ? incident.location.id : null }]
        );

        return execution;
    }

    @tryLogAsync()
    async get_comments(incidentId: number, showArchived: boolean): Promise<Result> {
        const result = await this.databaseManager
                    .ExecuteJsonSP(
                        "GetIncidentComments",
                        { incident_id: incidentId }, { show_archived: showArchived }
                    );

        return result;
    }

    @tryLogAsync()
    @firebaseEmitter(EVENTS_COLLECTION)
    async reschedule_incident(incident, newIncident, contact, responsibleId): Promise<Result> {
        const execution = await this.databaseManager.ExecuteTypedJsonSP(
            INCIDENT_RESCHEDULED,
            "RescheduleIncident",
            [{ incident: incident.id },
            { contact },
            { new_date: newIncident.date + " " + newIncident.start_hour },
            { responsible_id: responsibleId }]
        );

        return execution;
    }

    @tryLogAsync()
    @firebaseEmitter(EVENTS_COLLECTION)
    async register_contact_for_incident(incident, contact, responsibleId): Promise<Result> {
        const execution = await this.databaseManager.ExecuteTypedJsonSP(
            INCIDENT_TREATED,
            "RegisterContactForIncident",
            [{ incident: incident.id },
            { contact },
            { responsible_id: responsibleId }]
        );

        return execution;
    }

    @tryLogAsync()
    @firebaseEmitter(EVENTS_COLLECTION)
    async save_comment(incidentId, comment, responsibleId) {
        return await this.databaseManager
        .ExecuteTypedJsonSP(
            INCIDENT_COMMENT_ADDED,
            "SaveIncidentComment",
            [{incident_id: incidentId}, { comment }, {responsible_id: responsibleId}]);
    }

    @tryLogAsync()
    @firebaseEmitter(EVENTS_COLLECTION)
    async save_action_comment(incidentActionId, comment, responsibleId) {
        return await this.databaseManager
        .ExecuteTypedJsonSP(
            INCIDENT_ACTION_COMMENT_ADDED,
            "SaveIncidentActionComment",
            [{incident_action_id: incidentActionId},
             { comment },
             {responsible_id: responsibleId}]);
    }

    @tryLogAsync()
    @firebaseEmitter(EVENTS_COLLECTION)
    async archive_comment(commentId) {
        return await this.databaseManager
        .ExecuteTypedJsonSP(
            INCIDENT_COMMENT_ARCHIVED,
            "TogleIncidentCommentArchived",
            [{ comment_id: commentId }]);
    }

    private clearCurrentActivitiesCache() {
        refreshMethodCache("getCurrentActivities");
    }
}
