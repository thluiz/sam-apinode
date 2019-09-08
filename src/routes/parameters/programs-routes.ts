import * as auth from "../../middlewares/auth";
import { DatabaseManager } from "../../services/managers/database-manager";
import { DependencyManager } from "../../services/managers/dependency-manager";

export function routes(app) {
  const DBM = DependencyManager.container.resolve(DatabaseManager);

  app.get(
    "/api/domains",
    auth.ensureLoggedIn(),
    async (request, response, next) => {
      const result = await DBM.ExecuteJsonSP(`GetDomains`);

      response.send(result);
    }
  );

  app.get(
    "/api/programs",
    auth.ensureLoggedIn(),
    async (request, response, next) => {
      const result = await DBM.ExecuteJsonSP(`GetPrograms`);

      response.send(result);
    }
  );

  app.get("/api/products", auth.ensureLoggedIn(), async (request, res) => {
    try {
      const result = await DBM.ExecuteJsonListSQL(
        `select * from [vwProduct] where archived = 0 for json path`
      );

      res.send(result);
    } catch (error) {
      res.status(500).json(error);
    }
  });

  app.get(
    "/api/product_categories",
    auth.ensureLoggedIn(),
    async (req, res) => {
      try {
        const result = await DBM.ExecuteJsonListSQL(
          `select * from [product_category] for json path`
        );

        res.send(result);
      } catch (error) {
        res.status(500).json(error);
      }
    }
  );
}
