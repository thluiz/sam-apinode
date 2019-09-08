import * as auth from "../../middlewares/auth";

import { JobsService } from "../../services/jobs-service";
import { DatabaseManager } from "../../services/managers/database-manager";
import { ParametersService } from "../../services/parameters-service";

import { ErrorCode } from "../../helpers/errors-codes";
import { ErrorResult } from "../../helpers/result";
import { DependencyManager } from "../../services/managers/dependency-manager";

export function routes(app) {
  const PS = new ParametersService();
  const DBM = DependencyManager.container.resolve(DatabaseManager);

  app.get("/api/branches/:id?", auth.ensureLoggedIn(), async (req, res) => {
    try {
      const result = !req.params.id
        ? await DBM.ExecuteJsonSP(`GetBranches`)
        : await DBM.ExecuteJsonListSQL(
            `select * from vwBranch where id = @0 for json path`,
            req.params.id
          );

      res.send(result);
    } catch (error) {
      res.status(500).json({ error });
    }
  });

  app.get("/api/branches_timezones", async (req, res) => {
    try {
      const result = await DBM.ExecuteJsonSP(`GetBranchesTimezones`);

      res.send(result);
    } catch (error) {
      res.status(500).json({ error });
    }
  });

  app.get(
    "/api/all_branches/:id?",
    auth.ensureLoggedIn(),
    async (req, res) => {
      try {
        const result = !req.params.id
          ? await DBM.ExecuteJsonSP(`GetBranches`, { active: null })
          : await DBM.ExecuteJsonListSQL(
              `select * from vwBranch where id = @0 for json path`,
              req.params.id
            );

        res.send(result);
      } catch (error) {
        res.status(500).json({ error });
      }
    }
  );

  app.post("/api/branches_new", auth.ensureLoggedIn(), async (req, res) => {
    const result = await PS.create_branch(req.body.branch);

    if (!result.success) {
      res.send(result);
      return;
    }

    const updateVoucher = await new JobsService().update_voucher_site();

    if (!updateVoucher.success) {
      res.send(
        ErrorResult.Fail(
          ErrorCode.ParcialExecution,
          updateVoucher.data as Error,
          updateVoucher as ErrorResult
        )
      );
      return;
    }

    res.send(result);
  });

  app.get(
    "/api/branch_maps/branch/:id",
    auth.ensureLoggedIn(),
    async (req, res) => {
      const result = await DBM.ExecuteJsonSP("GetBranchMap", {
        branch_id: req.params.id
      });

      res.send(result);
    }
  );

  app.get(
    "/api/branch_products/branch/:id",
    auth.ensureLoggedIn(),
    async (req, res) => {
      const result = await DBM.ExecuteJsonSP("GetBranchProducts", {
        branch_id: req.params.id
      });

      res.send(result);
    }
  );

  app.post(
    "/api/branch_maps/archive",
    auth.ensureLoggedIn(),
    async (req, res) => {
      const result = await DBM.ExecuteSQLNoResults(
        `update branch_map set active = 0 where id = @0`,
        req.body.id
      );

      if (!result.success) {
        res.send(result);
        return;
      }

      const resultSiteUpdate = await new JobsService().update_voucher_site();
      res.send(resultSiteUpdate);
    }
  );

  app.post(
    "/api/branch_products/:id",
    auth.ensureLoggedIn(),
    async (req, res) => {
      const result = await DBM.ExecuteJsonSP(
        "SaveBranchProduct",
        { id: req.body.id },
        { branch_id: req.params.id },
        { currency_id: req.body.currency_id },
        { category_id: req.body.category_id },
        { name: req.body.name },
        { base_value: req.body.base_value }
      );

      res.send(result);
    }
  );

  app.post(
    "/api/branch_products/archive/:branch_id",
    auth.ensureLoggedIn(),
    async (req, res) => {
      const result = await DBM.ExecuteSQLNoResults(
        `update branch_product set archived = 1 where id = @0`,
        req.body.product.id
      );

      res.send(result);
    }
  );

  app.post("/api/branch_products", auth.ensureLoggedIn(), async (req, res) => {
    const result = await DBM.ExecuteJsonSP(
      "AssociateBranchProduct",
      { branch_id: req.body.branch_id },
      { product_id: req.body.product_id },
      { base_value: req.body.base_value }
    );

    res.send(result);
  });

  app.post("/api/branch_maps", auth.ensureLoggedIn(), async (req, res) => {
    const weekDays = req.body.week_days
      .filter(wk => wk.selected)
      .map(wk => {
        return wk.week_day;
      })
      .join(",");

    const result = await DBM.ExecuteJsonSP(
      "SaveBranchMap",
      { id: req.body.id || 0 },
      { branch_id: req.body.branch_id },
      { incident_type_id: req.body.incident_type_id },
      { receive_voucher: req.body.receive_voucher },
      { week_days: weekDays },
      { start_hour: req.body.start_time ? req.body.start_time.hour : 0 },
      { start_minute: req.body.start_time ? req.body.start_time.minute : 0 },
      { end_hour: req.body.end_time ? req.body.end_time.hour : 0 },
      { end_minute: req.body.end_time ? req.body.end_time.minute : 0 },
      { title: req.body.title }
    );

    if (!result.success) {
      res.send(result);
      return;
    }

    const resultSiteUpdate = await new JobsService().update_voucher_site();
    res.send(resultSiteUpdate);
  });

  app.post(
    "/api/branches_acquirers",
    auth.ensureLoggedIn(),
    async (req, res) => {
      const result = await DBM.ExecuteJsonSP(
        "ToggleBranchAcquirerAssociation",
        { branch_id: req.body.branch_id },
        { acquirer_id: req.body.acquirer_id }
      );

      res.send(result);
    }
  );

  app.post("/api/branches", auth.ensureLoggedIn(), async (req, res) => {
    const branch = req.body.branch;

    const result = await DBM.ExecuteSQLNoResults(
      `update branch set
            name = @1,
            abrev = @2,
            initials = @3,
            [order] = @4,
            contact_phone = @5,
            contact_email = @6,
            active = @7,
            default_currency_id = @8,
            timezone_id = @9
        where id = @0`,
      branch.id, branch.name, branch.abrev, branch.initials,
      branch.order, branch.contact_phone, branch.contact_email,
      branch.active, branch.default_currency_id,
      branch.timezone_id
    );

    res.send(result);
  });
}
