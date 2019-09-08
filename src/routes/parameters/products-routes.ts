import * as auth from "../../middlewares/auth";

import { Result } from "../../helpers/result";
import { DatabaseManager } from "../../services/managers/database-manager";
import { DependencyManager } from "../../services/managers/dependency-manager";

export function routes(app) {
  const DBM = DependencyManager.container.resolve(DatabaseManager);

  app.post("/api/products/archive", auth.ensureLoggedIn(), async (req, res) => {
    const product = req.body.product;

    const result = await DBM.ExecuteSQLNoResults(
      `update product set archived = 1 where id = @0`,
      product.id
    );

    res.send(result);
  });

  app.post("/api/products", auth.ensureLoggedIn(), async (req, res) => {
    const product = req.body.product;
    let result: Result<void> = null;
    if (product.id > 0) {
      result = await DBM.ExecuteSQLNoResults(
        `update product set
            name = @1,
            base_value = @2,
            [association_percentage] = @3,
            [im_percentage] = @4,
            [local_percentage] = @5,
            [association_minimal_value] = @6,
            [im_minimal_value] = @7,
            [local_minimal_value] = @8,
            currency_id = @9,
            category_id = @10
        where id = @0`,
        product.id, product.name, product.base_value,
        product.association_percentage,
        product.im_percentage,
        product.local_percentage,
        product.association_minimal_value,
        product.im_minimal_value,
        product.local_minimal_value,
        product.currency_id,
        product.category_id
      );
    } else {
      result = await DBM.ExecuteSQLNoResults(
        `insert into product (name, base_value,
            country_id, [association_percentage], im_percentage, local_percentage,
            association_minimal_value, im_minimal_value, local_minimal_value, currency_id, category_id)
        values (@0, @1, 1, @2, @3, @4,
            @5, @6, @7, @8, @9
        )`,
        product.name, product.base_value,
        product.association_percentage,
        product.im_percentage,
        product.local_percentage,
        product.association_minimal_value,
        product.im_minimal_value,
        product.local_minimal_value,
        product.currency_id,
        product.category_id
      );
    }

    res.send(result);
  });

  app.post(
    "/api/product_categories",
    auth.ensureLoggedIn(),
    async (req, res) => {
      const product_category = req.body.product_category;

      let result: Result<void> = null;

      if (product_category.id > 0) {
        result = await DBM.ExecuteSQLNoResults(
          `update product_category set
                name = @1
            where id = @0`,
          product_category.id,
          product_category.name
        );
      } else {
        result = await DBM.ExecuteSQLNoResults(
          `insert into product_category
            (name) values (@0)`,
          product_category.name
        );
      }

      res.send(result);
    }
  );
}
