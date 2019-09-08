import * as auth from "../middlewares/auth";
import { DatabaseManager } from "../services/managers/database-manager";
import { DependencyManager } from "../services/managers/dependency-manager";

export function routes(app) {
  const DBM = DependencyManager.container.resolve(DatabaseManager);

  app.get(
    "/api/financial/accounts/:branch_id?",
    auth.ensureLoggedIn(),
    async (req, res) => {
      const result = await DBM.ExecuteJsonSQL(
        `select a.*, isnull(b.abrev, 'Gestão Integrada') branch, isnull(b.initials, 'GI') branch_initials
          from account a
            left join branch b on b.id = a.branch_id
          where a.active = 1
            and ((@0 is null and a.branch_id is null) or (a.branch_id = @0))
          order by [order]
          for json path`,
          req.params.branch_id || null
      );

      res.send(result);
    }
  );

  app.get(
    "/api/financial_board/expected_payments/:account",
    auth.ensureLoggedIn(),
    async (req, res) => {
      const result = await DBM.ExecuteJsonSP(
        "GetPaymentsInPeriod",
        { account_id: req.params.account },
        { start_date: req.params.start_date || null },
        { end_date: req.params.end_date || null }
      );

      res.send(result);
    }
  );

  app.get(
    "/api/financial_board/account_status/:account",
    auth.ensureLoggedIn(),
    async (req, res) => {
      const result = await DBM.ExecuteJsonSP(
        "GetAccountStatusInPeriod",
        { account_id: req.params.account },
        { start_date: req.params.start_date || null },
        { end_date: req.params.end_date || null }
      );

      res.send(result);
    }
  );

  app.get(
    "/api/financial_board/missing_payments/:account",
    auth.ensureLoggedIn(),
    async (req, res) => {
      const result = await DBM.ExecuteJsonSP("GetMissingPayments", {
        account_id: req.params.account
      });

      res.send(result);
    }
  );

  app.post(
    "/api/financial/accounts",
    auth.ensureLoggedIn(),
    async (req, res) => {
      const account = req.body.account;

      if (account.id > 0) {
        await DBM.ExecuteSQLNoResults(
            `update account set
                name = @1,
                [order] = @2
            where id = @0`,
            account.id, account.name, account.order
        );
      } else {
        await DBM.ExecuteSQLNoResults(
            `insert into account (name, [order], branch_id, active)
                    values (@0, @1, @2, 1)`,
            account.name, account.order, account.branch
        );
      }

      res.send({ sucess: true });
    }
  );
}
