import * as auth from "../../middlewares/auth";

import { Branch } from "../../entity/Branch";
import { Country } from "../../entity/Country";
import { Location } from "../../entity/Location";

import { ErrorCode } from "../../helpers/errors-codes";
import { ErrorResult, SuccessResult } from "../../helpers/result";
import { DatabaseManager } from "../../services/managers/database-manager";
import { DependencyManager } from "../../services/managers/dependency-manager";

export function routes(app) {
  const DBM = DependencyManager.container.resolve(DatabaseManager);
  app.get("/api/locations", auth.ensureLoggedIn(), async (req, res, next) => {
    try {
      const LR = await DBM.getRepository<Location>(Location);
      let query = await LR.createQueryBuilder("l")
        .innerJoinAndSelect("l.country", "c")
        .leftJoinAndSelect("l.branch", "b")
        .orderBy("l.active desc, l.order");

      if (req.query.active) {
        query = query.where("l.active = :0", req.query.active);
      }

      const result = await query.getMany();

      res.send(SuccessResult.GeneralOk(result));
    } catch (error) {
      res.status(500).json(ErrorResult.Fail(ErrorCode.GenericError, error));
    }
  });

  app.post("/api/locations", auth.ensureLoggedIn(), async (req, res) => {
    try {
      const LR = await DBM.getRepository<Location>(Location);
      const loc = req.body.location;
      const location = loc.id > 0 ? await LR.findOne(loc.id) : new Location();

      if (loc.branch && loc.branch.id > 0) {
        const BR = await DBM.getRepository<Branch>(Branch);
        location.branch = await BR.findOne(loc.branch.id);
      }

      if (loc.country && loc.country.id > 0) {
        const CR = await DBM.getRepository<Country>(Country);
        location.country = await CR.findOne(loc.country.id);
      }

      location.active = loc.active;
      location.description = loc.description;
      location.name = loc.name;
      location.order = loc.order;

      const result = await LR.save(location);

      res.send(SuccessResult.GeneralOk(result));
    } catch (error) {
      res.status(500).json(ErrorResult.Fail(ErrorCode.GenericError, error));
    }
  });
}
