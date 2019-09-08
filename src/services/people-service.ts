import { BaseService } from "./base-service";
import { DatabaseManager } from "./managers/database-manager";

import { ErrorCode } from "../helpers/errors-codes";
import { ErrorResult, Result, SuccessResult } from "../helpers/result";

import { Person } from "../entity/Person";
import { Role } from "../entity/Role";

import { firebaseEmitter } from "../decorators/firebase-emitter-decorator";
import { tryLogAsync } from "../decorators/trylog-decorator";

export const PEOPLE_COLLECTION = "people-events";
export const PERSON_ADDED = "PERSON_ADDED";
export const PERSON_UPDATED_ACTION = "PERSON_UPDATED_ACTION";
export const PERSON_CHANGED = "PERSON_CHANGED";

export interface IPersonVoucherData {
    name: string; email: string; cpf: string; phone: string;
    socialLinks: string; voucher_id: number; branch_map_id: number;
    branch_id?: number; additionalAnswer ?: string; invite_key?: string;
}

export class PeopleService extends BaseService {
    @tryLogAsync()
    @firebaseEmitter(PEOPLE_COLLECTION)
    async create_person(name: string, roleId: number)
        : Promise<Result<Person>> {

        const RR = await this.getRepository(Role);
        const person = new Person();

        person.name = name;
        person.is_interested = roleId === 4;
        person.roles = [(await RR.findOne(roleId))];

        await this.save(person);

        return SuccessResult.Ok(PERSON_ADDED, person);
    }

    @tryLogAsync()
    async create_person_from_voucher(data: IPersonVoucherData) {
        return await  (await this.databaseManager).ExecuteSPNoResults("CreatePersonFromVoucher",
            { name : data.name },
            { email : data.email },
            { cpf : data.cpf },
            { phone : data.phone },
            { socialLinks : data.socialLinks },
            { branch_id : data.branch_id },
            { voucher_id : data.voucher_id },
            { additionalAnswer : data.additionalAnswer },
            { invite_key : data.invite_key },
            { branch_map_id : data.branch_map_id },
        );
    }

    @tryLogAsync()
    async save_avatar_image(personId: number, blobImage: string): Promise<Result<Person>> {
        try {
            const PR = await  (await this.databaseManager)
            .getRepository<Person>(Person);

            const person = await PR.findOne({id: personId});
            person.avatar_img = blobImage;
            person.avatar_md = false;
            person.avatar_sm = false;
            person.avatar_esm = false;
            await PR.save(person);

            return SuccessResult.GeneralOk(person);
        } catch (error) {
            // TODO: Remove file from blob
            return ErrorResult.Fail(ErrorCode.GenericError, error);
        }
    }

    @tryLogAsync()
    async pin_comment(commentId): Promise<Result<Person>> {
        const result = await  this.databaseManager
            .ExecuteTypedJsonSP<Person>(PERSON_UPDATED_ACTION,
            "ToglePersonCommentPinned", [{commentId }]);

        return result;
    }

    @tryLogAsync()
    async save_address(address) {
        return await this.databaseManager.ExecuteSPNoResults(
            `SaveAddress`,
            { person_id: address.person_id},
            { country_id: address.country_id},
            { postal_code: address.postal_code},
            { street: address.street},
            { district: address.district},
            { city: address.city},
            { state: address.state},
            { number: address.number},
            { complement: address.complement}
        );
    }

    @tryLogAsync()
    async archive_address(personAddress) {
        return await this.databaseManager.ExecuteSPNoResults(
            `ArchiveAddress`,
            { address_id: personAddress.address_id}
        );
    }

    @tryLogAsync()
    public async add_role(personId, roleId) {
        return await this.databaseManager.ExecuteSPNoResults(
            `AddPersonRole`,
            { person_id: personId },
            { role_id: roleId },
        );
    }

    @tryLogAsync()
    public async remove_role(personId, roleId) {
        return await this.databaseManager.ExecuteSPNoResults(
            `RemovePersonRole`,
            { person_id: personId },
            { role_id: roleId },
        );
    }

    @tryLogAsync()
    public async change_kf_name(personId, kfName, ideograms) {
        return await this.databaseManager.ExecuteSPNoResults(
            `AddAlias`,
            { person_id: personId },
            { alias: kfName },
            { ideograms },
        );
    }

    @tryLogAsync()
    @firebaseEmitter(PEOPLE_COLLECTION)
    public async update_person_data(person) {
        return await this.databaseManager.ExecuteTypedJsonSP("PERSON_CHANGED",
            `UpdatePersonData`,
            [ { id: person.id },
            { name: person.full_name || person.name },
            { birth_date :  person.birth_date },
            { admission_date :  person.admission_date },
            { enrollment_date :  person.enrollment_date },
            { baaisi_date :  person.baaisi_date },
            { passport_expiration_date :  person.passport_expiration_date },
            { kf_name :  person.kf_name },
            { identification :  person.identification },
            { identification2 :  person.identification2 },
            { passport :  person.passport },
            { occupation :  person.occupation },
            { kf_name_ideograms :  person.kf_name_ideograms },
            { gender :  person.gender },
            { shirt_size :  person.shirt_size },
            { pants_size :  person.pants_size },
            { family_id :  person.family_id > 0 ? person.family_id : null },
            { destiny_family_id :  person.destiny_family_id > 0 ? person.destiny_family_id : null },
            { branch_id :  person.branch_id > 0 ? person.branch_id : null },
            { domain_id :  person.domain_id > 0 ? person.domain_id : null },
            { program_id :  person.program_id > 0 ? person.program_id : null },
            { alias :  person.alias } ]
        );
    }

    @tryLogAsync()
    @firebaseEmitter(PEOPLE_COLLECTION)
    public async register_new_person(person, user) {
        return await this.databaseManager.ExecuteSPNoResults(
            `RegisterNewPerson`,
            { role_id: person.role_id > 0 ? person.role_id : null },
            { name: person.name },
            { branch_id: person.branch_id > 0 ? person.branch_id : null },
            { birth_date: person.birth_date },
            { identification: person.identification },
            { identification2: person.identification2 },
            { occupation: person.occupation },
            { next_incident_type: person.next_incident_type > 0 ? person.next_incident_type : null },
            { next_incident_date: person.next_incident_date && person.next_incident_date.length > 10 ?
                person.next_incident_date : null
            },
            { next_incident_description: person.next_incident_description },
            { initial_contact: person.initial_contact },
            { comment: person.comment },
            { user_id: user.id },
        );
    }

    @tryLogAsync()
    async remove_schedule(id) {
        return await this.databaseManager.ExecuteSPNoResults(
            `CancelPersonSchedule`,
            { person_schedule_id: id }
        );
    }

    @tryLogAsync()
    @firebaseEmitter(PEOPLE_COLLECTION)
    async save_schedule(schedule, responsibleId) {
        return await this.databaseManager.ExecuteSPNoResults(
            `SavePersonScheduleAndGenerateIncidents`,
            { person_id: schedule.person_id },
            { branch_id: schedule.branch_id },
            { location_id: schedule.location_id },
            { incident_type: schedule.incident_type },
            { recurrence_type: schedule.recurrence_type },
            { start_date: schedule.start_date },
            { start_hour: schedule.start_hour },
            { start_minute: schedule.start_minute },
            { end_date: schedule.end_date },
            { end_hour: schedule.end_hour },
            { end_minute: schedule.end_minute },
            { number_of_incidents: schedule.number_of_incidents },
            { description: schedule.description },
            { value: schedule.value },
            { responsible_id: responsibleId }
        );
    }

    @tryLogAsync()
    async remove_contact(id) {
        return await this.databaseManager.ExecuteSPNoResults(
            `RemovePersonContact`,
            { contact_id : id}
        );
    }

    @tryLogAsync()
    async save_contact(contactData) {
        return await this.databaseManager.ExecuteSPNoResults(
            `SavePersonContact`,
            { person_id : contactData.person_id},
            { contact_type : contactData.contact_type},
            { contact : contactData.contact},
            { details : contactData.details},
            { principal : contactData.principal}
        );
    }

    @tryLogAsync()
    async save_comment_about(personId, comment, responsibleId) {
        return await this.databaseManager.ExecuteSPNoResults(
            `SavePersonComment`,
            { person_id: personId },
            { comment },
            { responsible_id: responsibleId }
        );
    }

    @tryLogAsync()
    async archive_comment(commentId) {
        return await this.databaseManager.ExecuteSPNoResults(
            `ToglePersonCommentArchived`,
            { comment_id: commentId }
        );
    }
}
