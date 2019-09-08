import * as multer from "multer";
import { MulterAzureStorage } from "multer-azure-blob-storage";
import * as auth from "../../middlewares/auth";

import { PeopleRepository } from "../../repositories/people-repository";
import { PeopleService } from "../../services/people-service";

import { DatabaseManager } from "../../services/managers/database-manager";
import { DependencyManager } from "../../services/managers/dependency-manager";

import { JobsService } from "../../services/jobs-service";
import { SecurityService } from "../../services/security-service";

import { isArray } from "util";
import { SuccessResult } from "../../helpers/result";

const azureStorage: MulterAzureStorage = new MulterAzureStorage({
  connectionString: process.env.AZURE_AVATAR_STORAGE,
  containerName: "avatars",
  containerAccessLevel: "blob",
  urlExpirationTime: 60
});

const upload: multer.Instance = multer({
  storage: azureStorage
});

export function routes(app) {
  const PS = new PeopleService();
  const SS = new SecurityService();
  const PR = PeopleRepository;
  const DBM = DependencyManager.container.resolve(DatabaseManager);

  app.post(
    "/api/people/avatar_image",
    auth.ensureLoggedIn(),
    upload.any(),
    async (req, res) => {
      const result = await PS.save_avatar_image(
        req.body.id,
        req.files[0].blobName
      );

      res.send(result);
    }
  );

  app.get("/api/external_contacts", auth.ensureLoggedIn(), async (req, res) => {
    const result = await PR.getExternalContacts(
      req.query.branch > 0 ? req.query.branch : null,
      req.query.voucher > 0 ? req.query.voucher : null,
      req.query.name,
      req.query.voucher_status > 0 ? req.query.voucher_status : null,
      req.query.people_per_page > 0 ? req.query.people_per_page : null,
      req.query.page > 1 ? req.query.page : 1
    );

    res.send(result);
  });

  app.post(
    "/api/people_comments/pin",
    auth.ensureLoggedIn(),
    async (request, response) => {
      const result = await PS.pin_comment(request.body.id);

      response.send(result);
    }
  );

  app.get(
    "/api/people/members",
    auth.ensureLoggedIn(),
    async (req, response) => {
      const result = await DBM.ExecuteJsonSP("GetMembersList");

      response.send(result);
    }
  );

  app.get("/api/people", auth.ensureLoggedIn(), async (request, response) => {
    const result = await DBM.ExecuteJsonSP("GetPeopleList");

    response.send(result);
  });

  app.get(
    "/api/people/:id",
    auth.ensureLoggedIn(),
    async (request, response) => {
      if (request.params.id > 0) {
        const result = await DBM.ExecuteJsonSP("GetPersonData", {
          id: request.params.id
        });

        response.send(result);
      } else {
        response.status(404).json();
      }
    }
  );

  app.get(
    "/api/people/search/:name?",
    auth.ensureLoggedIn(),
    async (request, response) => {
      const result = await DBM.ExecuteJsonSP("GetPeopleByNameForTypeahead", {
        names: request.params.name
      });

      response.send(result.data);
    }
  );

  app.post("/api/people", auth.ensureLoggedIn(), async (request, res, next) => {
    try {
      const result = await PS.update_person_data(request.body.person);

      res.send(result);
    } catch (error) {
      res.status(500).json(error);
    }
  });

  app.post("/api/person", auth.ensureLoggedIn(), async (req, res, next) => {
    try {
      const result = await PS.register_new_person(
        req.body.person,
        SS.getUserFromRequest(req)
      );

      res.send(result);
    } catch (error) {
      res.status(500).json(error);
    }
  });

  app.get("/api/invited_people", auth.ensureLoggedIn(), async (req, res) => {
    const result = await DBM.ExecuteJsonSP(
      "GetInvitedPeople",
      { branch: req.query.branch > 0 ? req.query.branch : null },
      { voucher: req.query.voucher > 0 ? req.query.voucher : null },
      { name: req.query.name },
      {
        people_per_page:
          req.query.people_per_page > 0 ? req.query.people_per_page : null
      },
      { page: req.query.page > 1 ? req.query.page : 1 }
    );

    res.send(result);
  });

  app.get("/api/interested", auth.ensureLoggedIn(), async (req, res) => {
    const result = await DBM.ExecuteJsonSP(
      "GetPeopleInterested",
      { branch: req.query.branch > 0 ? req.query.branch : null },
      { name: req.query.name },
      {
        people_per_page:
          req.query.people_per_page > 0 ? req.query.people_per_page : null
      },
      { page: req.query.page > 1 ? req.query.page : 1 }
    );

    res.send(result);
  });

  app.get("/api/people-away", auth.ensureLoggedIn(), async (req, res) => {
    const result = await DBM.ExecuteJsonSP(
      "GetPeopleAway",
      { branch: req.query.branch > 0 ? req.query.branch : null },
      { name: req.query.name },
      {
        people_per_page:
          req.query.people_per_page > 0 ? req.query.people_per_page : null
      },
      { page: req.query.page > 1 ? req.query.page : 1 }
    );

    res.send(result);
  });

  app.get(
    "/api/service-providers",
    auth.ensureLoggedIn(),
    async (req, res, next) => {
      const result = await DBM.ExecuteJsonSP(
        "GetPeopleServiceProvider",
        { branch: req.query.branch > 0 ? req.query.branch : null },
        { name: req.query.name },
        {
          people_per_page:
            req.query.people_per_page > 0 ? req.query.people_per_page : null
        },
        { page: req.query.page > 1 ? req.query.page : 1 }
      );

      res.send(result);
    }
  );

  app.get("/api/people/:id", auth.ensureLoggedIn(), async (req, res) => {
    const result = await DBM.ExecuteJsonSP("GetPersonData", {
      id: req.params.id
    });

    res.send(result);
  });

  app.get(
    "/api/person_address/:person_id",
    auth.ensureLoggedIn(),
    async (req, res) => {
      const result = await DBM.ExecuteJsonSP("GetPersonAddress", {
        person_id: req.params.person_id
      });

      res.send(result);
    }
  );

  app.get(
    "/api/person_communication/pending/:person_id",
    auth.ensureLoggedIn(),
    async (req, res) => {
      const result = await DBM.ExecuteJsonSP("GetPersonPendingCommunication", {
        person_id: req.params.person_id
      });

      res.send(result);
    }
  );

  app.get(
    "/api/person_financial/pending/:person_id",
    auth.ensureLoggedIn(),
    async (req, res) => {
      const result = await DBM.ExecuteJsonSP("GetPersonPendingFinancial", {
        person_id: req.params.person_id
      });

      res.send(result);
    }
  );

  app.get(
    "/api/person_schedule/pending/:person_id",
    auth.ensureLoggedIn(),
    async (req, res) => {
      const result = await DBM.ExecuteJsonSP("GetPersonPendingSchedule", {
        person_id: req.params.person_id
      });

      res.send(result);
    }
  );

  app.post(
    "/api/person_address",
    auth.ensureLoggedIn(),
    async (request, response) => {
      const result = await PS.save_address(request.body.address);

      response.send(result);
    }
  );

  app.post(
    "/api/person_address/archive",
    auth.ensureLoggedIn(),
    async (request, response) => {
      const result = await PS.archive_address(request.body.person_address);

      response.send(result);
    }
  );

  /**
   * ROLES
   */

  app.post(
    "/api/person_role/delete",
    auth.ensureLoggedIn(),
    async (request, response, next) => {
      const result = await PS.remove_role(
        request.body.person_id,
        request.body.role_id
      );

      response.send(result);
    }
  );

  app.get("/api/person_role", auth.ensureLoggedIn(), async (req, response) => {
    const result = await DBM.ExecuteJsonSP("GetRoles");

    response.send(result);
  });

  app.post(
    "/api/person_role",
    auth.ensureLoggedIn(),
    async (request, response) => {
      await PS.add_role(request.body.person_id, request.body.role_id);

      response.send({ sucess: true });
    }
  );

  app.get(
    "/api/person_role/person/:id",
    auth.ensureLoggedIn(),
    async (request, res) => {
      const result = await DBM.ExecuteJsonSP("GetPersonRoles", {
        person_id: request.params.id
      });

      res.send(result);
    }
  );

  /**
   * ALIAS
   */

  app.post(
    "/api/people_alias/kf_name",
    auth.ensureLoggedIn(),
    async (request, response) => {
      await PS.change_kf_name(
        request.body.person_id,
        request.body.kf_name,
        request.body.ideograms
      );

      response.send({ sucess: true });
    }
  );

  /* CONTACTS */

  app.post(
    "/api/person_contact/remove",
    auth.ensureLoggedIn(),
    async (request, response) => {
      await PS.remove_contact(request.body.contact_id);

      response.send({ sucess: true });
    }
  );

  app.post(
    "/api/person_contact",
    auth.ensureLoggedIn(),
    async (request, res) => {
      try {
        await PS.save_contact({
          person_id: request.body.person_id,
          contact_type: request.body.contact_type,
          contact: request.body.contact,
          details: request.body.details,
          principal: request.body.principal
        });

        res.send({ sucess: true });
      } catch (error) {
        res.status(500).json(error);
      }
    }
  );

  app.get(
    "/api/person_contact/person/:id/:only_principal?",
    auth.ensureLoggedIn(),
    async (request, res) => {
      try {
        const result = await DBM.ExecuteJsonSP(
          "GetPersonContacts",
          { person_id: request.params.id },
          { only_principal: request.params.only_principal || 0 }
        );

        res.send(result);
      } catch (error) {
        res.status(500).json(error);
      }
    }
  );

  app.get(
    "/api/person/missing_data/:id",
    auth.ensureLoggedIn(),
    async (request, res) => {
      try {
        const result = await DBM.ExecuteJsonSP("GetPersonMissingData", {
          person_id: request.params.id
        });

        res.send(result);
      } catch (error) {
        res.status(500).json(error);
      }
    }
  );

  app.get(
    "/api/person/offering",
    auth.ensureLoggedIn(),
    async (request, res) => {
      try {
        const result = await DBM.ExecuteJsonSP("GetPersonOfferingAvailable", {
          person_id: request.query.person_id
        });

        res.send(result);
      } catch (error) {
        res.status(500).json(error);
      }
    }
  );

  /**
   * PARTNERSHIP INDICATIONS
   */

  app.get(
    "/api/person_partnerships/person/:id",
    auth.ensureLoggedIn(),
    async (req, res) => {
      try {
        const result = await DBM.ExecuteJsonListSQL(
          `select * from person_partnership where person_id = @person for json path`,
          { person: req.params.id }
        );

        res.send(result);
      } catch (error) {
        res.status(500).json(error);
      }
    }
  );

  app.post(
    "/api/person_partnerships",
    auth.ensureLoggedIn(),
    async (req, res) => {
      try {
        const partnership = req.body.partnership;

        const result = await DBM.ExecuteSPNoResults("SaveNewPartnership", {
          person_id: partnership.person_id,
          comments: partnership.comment,
          name: partnership.name,
          branch_id: partnership.branch_id,
          operator_id: partnership.operator_id,
          indication_contact_type: partnership.indication_contact_type
        });

        res.send(result);
      } catch (error) {
        res.status(500).json(error);
      }
    }
  );

  /**
   * EXTERNAL UNIT INDICATIONS
   */

  app.get(
    "/api/person_external_units/person/:id",
    auth.ensureLoggedIn(),
    async (req, res, next) => {
      try {
        const result = await DBM.ExecuteJsonListSQL(
          `select * from person_external_unit where person_id = @0 for json path`,
          req.params.id
        );

        res.send(result);
      } catch (error) {
          res.status(500).json(error);
      }
    }
  );

  app.post(
    "/api/person_external_units",
    auth.ensureLoggedIn(),
    async (req, res) => {
      try {
        const externalUnit = req.body.external_unit;

        const result = await DBM.ExecuteSPNoResults("SaveNewExternalUnit", {
          person_id: externalUnit.person_id,
          comments: externalUnit.comment,
          name: externalUnit.name,
          branch_id: externalUnit.branch_id,
          operator_id: externalUnit.operator_id,
          indication_contact_type: externalUnit.indication_contact_type
        });

        res.send(result);
      } catch (error) {
        res.status(500).json(error);
      }
    }
  );

  /**
   * INDICATIONS
   */

  app.get(
    "/api/person_indications/person/:id",
    auth.ensureLoggedIn(),
    async (req, res) => {
      try {
        const result = await DBM.ExecuteJsonListSQL(
          `select * from vwPersonRelationships
            where relationship_type in (10, 13, 14) and person_id = @0
            for json path`,
          req.params.id
        );

        if (!isArray(result.data)) {
          res.send(SuccessResult.GeneralOk([]));
          return;
        }

        res.send(result);
      } catch (error) {
        res.status(500).json(error);
      }
    }
  );

  app.post(
    "/api/person_indications",
    auth.ensureLoggedIn(),
    async (req, res) => {
      try {
        const indication = req.body.indication;

        const result = await DBM.ExecuteSPNoResults(
          "SaveNewIndication",
          { name: indication.name },
          { person_id: indication.person_id },
          { contact_type1: indication.contact_type1 },
          { contact_type2: indication.contact_type2 },
          { contact_type3: indication.contact_type3 },
          { comments: indication.comment },
          { contact1: indication.contact1 },
          { contact2: indication.contact2 },
          { contact3: indication.contact3 },
          { indication_contact_type: indication.indication_contact_type },
          { branch_id: indication.branch_id },
          { operator_id: indication.operator_id },
          { age: indication.age > 0 ? indication.age : 0 },
          { district: indication.district },
          { occupation: indication.occupation }
        );

        if (result.success) {
          try {
            const voucherUpdate = await new JobsService().update_voucher_site();
            if (!voucherUpdate.success) {
              res.send(voucherUpdate);
              return;
            }
          } catch (error) {
            res.status(500).json(error);
            return;
          }
        }

        res.send(result);

      } catch (error) {
        res.status(500).json(error);
      }
    }
  );

  /**
   * SCHEDULING
   */

  app.post(
    "/api/person_schedule/delete",
    auth.ensureLoggedIn(),
    async (request, response, next) => {
      await PS.remove_schedule(request.body.id);

      response.send({ sucess: true });
    }
  );

  app.get(
    "/api/person_schedule/person/:id",
    auth.ensureLoggedIn(),
    async (request, res) => {
      try {
        const result = await DBM.ExecuteJsonSP("GetPersonScheduling", {
          person_id: request.params.id
        });

        res.send(result);
      } catch (error) {
        res.status(500).json(error);
      }
    }
  );

  app.post(
    "/api/person_schedule",
    auth.ensureLoggedIn(),
    async (request, response) => {
      const user = await SS.getUserFromRequest(request);
      const responsibleId = await user.getPersonId();

      const result = await PS.save_schedule(request.body.schedule, responsibleId);

      response.send(result);
    }
  );

  /**
   * COMMENTS
   */

  app.get(
    "/api/people_comments/about/:id/:show_archived?",
    auth.ensureLoggedIn(),
    async (request, res) => {
      try {
        const result = await DBM.ExecuteJsonSP(
          "GetCommentsAboutPerson",
          { person_id: request.params.id },
          { show_archived: request.params.show_archived || 0 }
        );

        res.send(result);
      } catch (error) {
        res.status(500).json(error);
      }
    }
  );

  app.post(
    "/api/people_comments/about",
    auth.ensureLoggedIn(),
    async (request, response) => {
      const user = await SS.getUserFromRequest(request);
      const responsibleId = await user.getPersonId();

      const result = await PS.save_comment_about(
        request.body.person_id,
        request.body.comment,
        responsibleId
      );

      response.send(result);
    }
  );

  app.post(
    "/api/people_comments/archive",
    auth.ensureLoggedIn(),
    async (request, response) => {
      const result = await PS.archive_comment(request.body.id);

      response.send(result);
    }
  );
}
