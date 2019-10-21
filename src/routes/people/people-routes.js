"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer = require("multer");
const multer_azure_blob_storage_1 = require("multer-azure-blob-storage");
const auth = require("../../middlewares/auth");
const people_repository_1 = require("../../repositories/people-repository");
const people_service_1 = require("../../services/people-service");
const database_manager_1 = require("../../services/managers/database-manager");
const dependency_manager_1 = require("../../services/managers/dependency-manager");
const jobs_service_1 = require("../../services/jobs-service");
const security_service_1 = require("../../services/security-service");
const util_1 = require("util");
const result_1 = require("../../helpers/result");
const azureStorage = new multer_azure_blob_storage_1.MulterAzureStorage({
    connectionString: process.env.AZURE_AVATAR_STORAGE,
    containerName: "avatars",
    containerAccessLevel: "blob",
    urlExpirationTime: 60
});
const upload = multer({
    storage: azureStorage
});
function routes(app) {
    const PS = new people_service_1.PeopleService();
    const SS = new security_service_1.SecurityService();
    const PR = people_repository_1.PeopleRepository;
    const DBM = dependency_manager_1.DependencyManager.container.resolve(database_manager_1.DatabaseManager);
    app.post("/api/people/avatar_image", auth.ensureLoggedIn(), upload.any(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield PS.save_avatar_image(req.body.id, req.files[0].blobName);
        res.send(result);
    }));
    app.get("/api/external_contacts", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield PR.getExternalContacts(req.query.branch > 0 ? req.query.branch : null, req.query.voucher > 0 ? req.query.voucher : null, req.query.name, req.query.voucher_status > 0 ? req.query.voucher_status : null, req.query.people_per_page > 0 ? req.query.people_per_page : null, req.query.page > 1 ? req.query.page : 1);
        res.send(result);
    }));
    app.post("/api/people_comments/pin", auth.ensureLoggedIn(), (request, response) => __awaiter(this, void 0, void 0, function* () {
        const result = yield PS.pin_comment(request.body.id);
        response.send(result);
    }));
    app.get("/api/people/members", auth.ensureLoggedIn(), (req, response) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP("GetMembersList");
        response.send(result);
    }));
    app.get("/api/people", auth.ensureLoggedIn(), (request, response) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP("GetPeopleList");
        response.send(result);
    }));
    app.get("/api/people/:id", auth.ensureLoggedIn(), (request, response) => __awaiter(this, void 0, void 0, function* () {
        if (request.params.id > 0) {
            const result = yield DBM.ExecuteJsonSP("GetPersonData", {
                id: request.params.id
            });
            response.send(result);
        }
        else {
            response.status(404).json();
        }
    }));
    app.get("/api/people/search/:name?", auth.ensureLoggedIn(), (request, response) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP("GetPeopleByNameForTypeahead", {
            names: request.params.name
        });
        response.send(result.data);
    }));
    app.post("/api/people", auth.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield PS.update_person_data(request.body.person);
            res.send(result);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.post("/api/person", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield PS.register_new_person(req.body.person, SS.getUserFromRequest(req));
            res.send(result);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.get("/api/invited_people", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP("GetInvitedPeople", { branch: req.query.branch > 0 ? req.query.branch : null }, { voucher: req.query.voucher > 0 ? req.query.voucher : null }, { name: req.query.name }, {
            people_per_page: req.query.people_per_page > 0 ? req.query.people_per_page : null
        }, { page: req.query.page > 1 ? req.query.page : 1 });
        res.send(result);
    }));
    app.get("/api/interested", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP("GetPeopleInterested", { branch: req.query.branch > 0 ? req.query.branch : null }, { name: req.query.name }, {
            people_per_page: req.query.people_per_page > 0 ? req.query.people_per_page : null
        }, { page: req.query.page > 1 ? req.query.page : 1 });
        res.send(result);
    }));
    app.get("/api/people-away", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP("GetPeopleAway", { branch: req.query.branch > 0 ? req.query.branch : null }, { name: req.query.name }, {
            people_per_page: req.query.people_per_page > 0 ? req.query.people_per_page : null
        }, { page: req.query.page > 1 ? req.query.page : 1 });
        res.send(result);
    }));
    app.get("/api/service-providers", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP("GetPeopleServiceProvider", { branch: req.query.branch > 0 ? req.query.branch : null }, { name: req.query.name }, {
            people_per_page: req.query.people_per_page > 0 ? req.query.people_per_page : null
        }, { page: req.query.page > 1 ? req.query.page : 1 });
        res.send(result);
    }));
    app.get("/api/people/:id", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP("GetPersonData", {
            id: req.params.id
        });
        res.send(result);
    }));
    app.get("/api/person_address/:person_id", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP("GetPersonAddress", {
            person_id: req.params.person_id
        });
        res.send(result);
    }));
    app.get("/api/person_communication/pending/:person_id", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP("GetPersonPendingCommunication", {
            person_id: req.params.person_id
        });
        res.send(result);
    }));
    app.get("/api/person_financial/pending/:person_id", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP("GetPersonPendingFinancial", {
            person_id: req.params.person_id
        });
        res.send(result);
    }));
    app.get("/api/person_schedule/pending/:person_id", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP("GetPersonPendingSchedule", {
            person_id: req.params.person_id
        });
        res.send(result);
    }));
    app.post("/api/person_address", auth.ensureLoggedIn(), (request, response) => __awaiter(this, void 0, void 0, function* () {
        const result = yield PS.save_address(request.body.address);
        response.send(result);
    }));
    app.post("/api/person_address/archive", auth.ensureLoggedIn(), (request, response) => __awaiter(this, void 0, void 0, function* () {
        const result = yield PS.archive_address(request.body.person_address);
        response.send(result);
    }));
    /**
     * ROLES
     */
    app.post("/api/person_role/delete", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield PS.remove_role(request.body.person_id, request.body.role_id);
        response.send(result);
    }));
    app.get("/api/person_role", auth.ensureLoggedIn(), (req, response) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP("GetRoles");
        response.send(result);
    }));
    app.post("/api/person_role", auth.ensureLoggedIn(), (request, response) => __awaiter(this, void 0, void 0, function* () {
        yield PS.add_role(request.body.person_id, request.body.role_id);
        response.send({ sucess: true });
    }));
    app.get("/api/person_role/person/:id", auth.ensureLoggedIn(), (request, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield DBM.ExecuteJsonSP("GetPersonRoles", {
            person_id: request.params.id
        });
        res.send(result);
    }));
    /**
     * ALIAS
     */
    app.post("/api/people_alias/kf_name", auth.ensureLoggedIn(), (request, response) => __awaiter(this, void 0, void 0, function* () {
        yield PS.change_kf_name(request.body.person_id, request.body.kf_name, request.body.ideograms);
        response.send({ sucess: true });
    }));
    /* CONTACTS */
    app.post("/api/person_contact/remove", auth.ensureLoggedIn(), (request, response) => __awaiter(this, void 0, void 0, function* () {
        yield PS.remove_contact(request.body.contact_id);
        response.send({ sucess: true });
    }));
    app.post("/api/person_contact", auth.ensureLoggedIn(), (request, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield PS.save_contact({
                person_id: request.body.person_id,
                contact_type: request.body.contact_type,
                contact: request.body.contact,
                details: request.body.details,
                principal: request.body.principal
            });
            res.send({ sucess: true });
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.get("/api/person_contact/person/:id/:only_principal?", auth.ensureLoggedIn(), (request, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield DBM.ExecuteJsonSP("GetPersonContacts", { person_id: request.params.id }, { only_principal: request.params.only_principal || 0 });
            res.send(result);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.get("/api/person/missing_data/:id", auth.ensureLoggedIn(), (request, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield DBM.ExecuteJsonSP("GetPersonMissingData", {
                person_id: request.params.id
            });
            res.send(result);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.get("/api/person/offering", auth.ensureLoggedIn(), (request, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield DBM.ExecuteJsonSP("GetPersonOfferingAvailable", {
                person_id: request.query.person_id
            });
            res.send(result);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    /**
     * PARTNERSHIP INDICATIONS
     */
    app.get("/api/person_partnerships/person/:id", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield DBM.ExecuteJsonListSQL(`select * from person_partnership where person_id = @person for json path`, { person: req.params.id });
            res.send(result);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.post("/api/person_partnerships", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const partnership = req.body.partnership;
            const result = yield DBM.ExecuteSPNoResults("SaveNewPartnership", {
                person_id: partnership.person_id,
                comments: partnership.comment,
                name: partnership.name,
                branch_id: partnership.branch_id,
                operator_id: partnership.operator_id,
                indication_contact_type: partnership.indication_contact_type
            });
            res.send(result);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    /**
     * EXTERNAL UNIT INDICATIONS
     */
    app.get("/api/person_external_units/person/:id", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield DBM.ExecuteJsonListSQL(`select * from person_external_unit where person_id = @0 for json path`, req.params.id);
            res.send(result);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.post("/api/person_external_units", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const externalUnit = req.body.external_unit;
            const result = yield DBM.ExecuteSPNoResults("SaveNewExternalUnit", {
                person_id: externalUnit.person_id,
                comments: externalUnit.comment,
                name: externalUnit.name,
                branch_id: externalUnit.branch_id,
                operator_id: externalUnit.operator_id,
                indication_contact_type: externalUnit.indication_contact_type
            });
            res.send(result);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    /**
     * INDICATIONS
     */
    app.get("/api/person_indications/person/:id", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield DBM.ExecuteJsonListSQL(`select * from vwPersonRelationships
            where relationship_type in (10, 13, 14) and person_id = @0
            for json path`, req.params.id);
            if (!util_1.isArray(result.data)) {
                res.send(result_1.SuccessResult.GeneralOk([]));
                return;
            }
            res.send(result);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.post("/api/person_indications", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const indication = req.body.indication;
            const result = yield DBM.ExecuteSPNoResults("SaveNewIndication", { name: indication.name }, { person_id: indication.person_id }, { contact_type1: indication.contact_type1 }, { contact_type2: indication.contact_type2 }, { contact_type3: indication.contact_type3 }, { comments: indication.comment }, { contact1: indication.contact1 }, { contact2: indication.contact2 }, { contact3: indication.contact3 }, { indication_contact_type: indication.indication_contact_type }, { branch_id: indication.branch_id }, { operator_id: indication.operator_id }, { age: indication.age > 0 ? indication.age : 0 }, { district: indication.district }, { occupation: indication.occupation });
            if (result.success) {
                try {
                    const voucherUpdate = yield new jobs_service_1.JobsService().update_voucher_site();
                    if (!voucherUpdate.success) {
                        res.send(voucherUpdate);
                        return;
                    }
                }
                catch (error) {
                    res.status(500).json(error);
                    return;
                }
            }
            res.send(result);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    /**
     * SCHEDULING
     */
    app.post("/api/person_schedule/delete", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        yield PS.remove_schedule(request.body.id);
        response.send({ sucess: true });
    }));
    app.get("/api/person_schedule/person/:id", auth.ensureLoggedIn(), (request, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield DBM.ExecuteJsonSP("GetPersonScheduling", {
                person_id: request.params.id
            });
            res.send(result);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.post("/api/person_schedule", auth.ensureLoggedIn(), (request, response) => __awaiter(this, void 0, void 0, function* () {
        const user = yield SS.getUserFromRequest(request);
        const responsibleId = yield user.getPersonId();
        const result = yield PS.save_schedule(request.body.schedule, responsibleId);
        response.send(result);
    }));
    /**
     * COMMENTS
     */
    app.get("/api/people_comments/about/:id/:show_archived?", auth.ensureLoggedIn(), (request, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield DBM.ExecuteJsonSP("GetCommentsAboutPerson", { person_id: request.params.id }, { show_archived: request.params.show_archived || 0 });
            res.send(result);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.post("/api/people_comments/about", auth.ensureLoggedIn(), (request, response) => __awaiter(this, void 0, void 0, function* () {
        const user = yield SS.getUserFromRequest(request);
        const responsibleId = yield user.getPersonId();
        const result = yield PS.save_comment_about(request.body.person_id, request.body.comment, responsibleId);
        response.send(result);
    }));
    app.post("/api/people_comments/archive", auth.ensureLoggedIn(), (request, response) => __awaiter(this, void 0, void 0, function* () {
        const result = yield PS.archive_comment(request.body.id);
        response.send(result);
    }));
}
exports.routes = routes;
//# sourceMappingURL=people-routes.js.map