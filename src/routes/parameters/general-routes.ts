import * as auth from "../../middlewares/auth";

import { Result } from "../../helpers/result";
import { DatabaseManager } from "../../services/managers/database-manager";
import { DependencyManager } from "../../services/managers/dependency-manager";

export function routes(app) {
  const DBM = DependencyManager.container.resolve(DatabaseManager);

  app.get("/api/server_timezone", async (request, res) => {
    const date = new Date();

    res.send({ timezone: 0 /* - date.getTimezoneOffset() / 60 */ });
  });

  app.get("/api/countries", auth.ensureLoggedIn(), async (request, res) => {
    const result = await DBM.ExecuteJsonListSQL(
      `select * from [country] order by [order] for json path`
    );

    res.send(result);
  });

  app.get(
    "/api/kf_families",
    auth.ensureLoggedIn(),
    async (request, response) => {
      const result = await DBM.ExecuteJsonSP(`GetKungFuFamilies`);
      response.send(result);
    }
  );

  app.get(
    "/api/recurrence_types",
    auth.ensureLoggedIn(),
    async (req, response) => {
      const result = await DBM.ExecuteJsonSP(`GetRecurrenceTypes`);
      response.send(result);
    }
  );

  app.get(
    "/api/relationship_types",
    auth.ensureLoggedIn(),
    async (request, res) => {
      const result = await DBM.ExecuteJsonListSQL(
        `select * from [enum_relationship_type] where active = 1 for json path`
      );

      res.send(result);
    }
  );

  app.get(
    "/api/incident_types",
    auth.ensureLoggedIn(),
    async (request, response) => {
      const result = await DBM.ExecuteJsonSP(`GetIncidentTypes`);
      response.send(result);
    }
  );

  app.get(
    "/api/contact_types",
    auth.ensureLoggedIn(),
    async (request, response) => {
      const result = await DBM.ExecuteJsonSP(`GetContactTypes`);
      response.send(result);
    }
  );

  app.get("/api/roles", auth.ensureLoggedIn(), async (request, response) => {
    const result = await DBM.ExecuteJsonSP(`GetRoles`);
    response.send(result);
  });

  app.get("/api/groups", auth.ensureLoggedIn(), async (req, res) => {
    const result = await DBM.ExecuteJsonListSQL(
      `select * from [group] where active = 1 order by [order] for json path`
    );

    res.send(result);
  });

  app.get("/api/payment_methods", auth.ensureLoggedIn(), async (req, res) => {
    const result = await DBM.ExecuteJsonListSQL(
      `select * from payment_method where active = 1 order by [order] for json path`
    );

    res.send(result);
  });

  app.get("/api/acquirers", auth.ensureLoggedIn(), async (req, res) => {
    const result = await DBM.ExecuteJsonListSQL(
      `select * from acquirer where active = 1 order by [order] for json path`
    );

    res.send(result);
  });

  app.get("/api/currencies", auth.ensureLoggedIn(), async (req, res, next) => {
    const result = await DBM.ExecuteJsonListSQL(
      `select * from currency for json path`
    );

    res.send(result);
  });

  /**
   * UPDATES
   */

  app.post("/api/payment_methods", auth.ensureLoggedIn(), async (req, res) => {
    const payment_method = req.body.payment_method;

    let result: Result<void> = null;

    if (payment_method.id > 0) {
      result = await DBM.ExecuteSQLNoResults(
        `update payment_method set
            name = @name,
            [order] = @order
        where id = @id`,
        { id: payment_method.id },
        { name: payment_method.name },
        { order: payment_method.order }
      );
    } else {
      result = await DBM.ExecuteSQLNoResults(
        `insert into payment_method
            (name, [order])
        values
            (@name, @order)`,
        { name: payment_method.name },
        { order: payment_method.order }
      );
    }

    res.send(result);
  });

  app.post("/api/acquirers", auth.ensureLoggedIn(), async (req, res) => {
    const acquirer = req.body.acquirer;
    let result: Result<void> = null;

    if (acquirer.id > 0) {
      result = await DBM.ExecuteSQLNoResults(
        `update acquirer set
            name = @1,
            [order] = @2
        where id = @0`,
        acquirer.id, acquirer.name, acquirer.order
      );
    } else {
      result = await DBM.ExecuteSQLNoResults(
        `insert into acquirer
            (name, [order])
        values
            (@0, @1)`,
        acquirer.name, acquirer.order
      );
    }

    res.send(result);
  });

  app.post("/api/currencies", auth.ensureLoggedIn(), async (req, res) => {
    const currency = req.body.currency;
    let result: Result<void> = null;

    if (currency.id > 0) {
      result = await DBM.ExecuteSQLNoResults(
        `update currency set
            name = @1,
            [symbol] = @2
        where id = @0`,
        currency.id, currency.name, currency.symbol
      );
    } else {
      result = await DBM.ExecuteSQLNoResults(
        `insert into currency
            (name, [symbol])
        values
            (@0, @1)`,
        currency.name, currency.symbol
      );
    }

    res.send(result);
  });
}
