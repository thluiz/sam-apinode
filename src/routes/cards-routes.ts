import * as auth from "../middlewares/auth";

import { ErrorCode } from "../helpers/errors-codes";
import { CardsService } from "../services/cards-service";
import { LoggerService } from "../services/logger-service";
import { SecurityService } from "../services/security-service";

import { CardsRepository } from "../repositories/cards-repository";

import { DatabaseManager } from "../services/managers/database-manager";
import { DependencyManager } from "../services/managers/dependency-manager";

export function routes(app) {
  const DBM = DependencyManager.container.resolve(DatabaseManager);
  const CS = new CardsService();
  const SS = new SecurityService();

  app.get("/api/cards/:id", auth.ensureLoggedIn(), async (req, res) => {
    const result = await DBM.ExecuteJsonListSQL(
      "select * from vwCard where id = @0 for json path",
      req.params.id
    );

    res.send(result);
  });

  app.get(
    "/api/person_card_positions",
    auth.ensureLoggedIn(),
    async (req, res) => {
      const result = await DBM.ExecuteJsonListSQL(
        "select * from person_card_position where active = 1 for json path"
      );

      res.send(result);
    }
  );

  app.get("/api/operators", auth.ensureLoggedIn(), async (req, res) => {
    const result = await DBM.ExecuteJsonListSQL(
      `select *
                from vwPerson v
                where is_operator = 1 or is_director = 1 or is_manager = 1
                order by name for json path`
    );

    res.send(result);
  });

  app.get("/api/card_templates", auth.ensureLoggedIn(), async (_, res) => {
    const result = await DBM.ExecuteJsonListSQL(
      `select *
                from card_template
                where active = 1
                order by [order]
                for json path`
    );

    res.send(result);
  });

  app.get("/api/organizations/flat", auth.ensureLoggedIn(), async (_, res) => {
    const result = await DBM.ExecuteJsonSP("GetFlatOrganizationsData");

    res.send(result);
  });

  app.get(
    "/api/organizations/:id?/:include_childrens?",
    auth.ensureLoggedIn(),
    async (req, res) => {
      try {
        const result = await new CardsRepository().getOrganizations(
          req.params.id,
          req.params.include_childrens
        );

        res.send(result);
      } catch (error) {
        LoggerService.error(ErrorCode.CardsActions, error);
        res.status(500).json(error);
      }
    }
  );

  app.get("/api/projects/:id",
  auth.ensureLoggedIn(),
  async (req, res) => {
    try {
      const result = await new CardsRepository().getProject(req.params.id);
      res.send(result);
    } catch (error) {
      LoggerService.error(ErrorCode.CardsActions, error);
      res.status(500).json(error);
    }
  });

  app.post("/api/person_cards", auth.ensureLoggedIn(), async (req, res) => {
    const result = await CS.save_person_card(req.body.person_card);

    res.send(result);
  });

  app.post("/api/cards", auth.ensureLoggedIn(), async (req, res) => {
    const user = await SS.getUserFromRequest(req);
    const result = await CS.save_card(req.body.card, await user.getPersonId());

    res.send(result);
  });

  app.post("/api/move_card", auth.ensureLoggedIn(), async (req, res) => {
    const user = await SS.getUserFromRequest(req);

    const result = CS.moveCard(req.body, user);

    res.send(result);
  });

  app.post("/api/cards_comments", auth.ensureLoggedIn(), async (req, res) => {
    const user = await SS.getUserFromRequest(req);
    const result = await CS.save_card_comment(
      req.body.card,
      req.body.comment,
      req.body.commentary_type,
      await user.getPersonId()
    );

    res.send(result);
  });

  app.get(
    "/api/cards_comments/:card_id",
    auth.ensureLoggedIn(),
    async (req, res) => {
      const result = await DBM.ExecuteJsonSP("GetCardCommentaries", {
        card_id: req.params.card_id
      });

      res.send(result);
    }
  );

  app.post("/api/cards/steps", auth.ensureLoggedIn(), async (req, res) => {
    const user = await SS.getUserFromRequest(req);
    const result = await CS.save_card_step(
      req.body.card_id,
      req.body.step_id,
      await user.getPersonId()
    );

    res.send(result);
  });

  app.post(
    "/api/cards/steps/card_order",
    auth.ensureLoggedIn(),
    async (req, res) => {
      const result = await CS.save_card_order(req.body.card_id, req.body.order);

      res.send(result);
    }
  );

  app.post(
    "/api/person_cards/delete",
    auth.ensureLoggedIn(),
    async (req, res) => {
      const result = await CS.remove_person_card(req.body.person_card);

      res.send(result);
    }
  );

  app.post("/api/archive_card", auth.ensureLoggedIn(), async (req, res) => {
    const user = await SS.getUserFromRequest(req);
    const result = await CS.toggle_card_archived(
      req.body.card,
      await user.getPersonId()
    );

    res.send(result);
  });
}
