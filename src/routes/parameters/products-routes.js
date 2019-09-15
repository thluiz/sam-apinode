"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth = require("../../middlewares/auth");
const database_manager_1 = require("../../services/managers/database-manager");
const dependency_manager_1 = require("../../services/managers/dependency-manager");
function routes(app) {
    const DBM = dependency_manager_1.DependencyManager.container.resolve(database_manager_1.DatabaseManager);
    app.post("/api/products/archive", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const product = req.body.product;
        const result = yield DBM.ExecuteSQLNoResults(`update product set archived = 1 where id = @0`, product.id);
        res.send(result);
    }));
    app.post("/api/products", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const product = req.body.product;
        let result = null;
        if (product.id > 0) {
            result = yield DBM.ExecuteSQLNoResults(`update product set
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
        where id = @0`, product.id, product.name, product.base_value, product.association_percentage, product.im_percentage, product.local_percentage, product.association_minimal_value, product.im_minimal_value, product.local_minimal_value, product.currency_id, product.category_id);
        }
        else {
            result = yield DBM.ExecuteSQLNoResults(`insert into product (name, base_value,
            country_id, [association_percentage], im_percentage, local_percentage,
            association_minimal_value, im_minimal_value, local_minimal_value, currency_id, category_id)
        values (@0, @1, 1, @2, @3, @4,
            @5, @6, @7, @8, @9
        )`, product.name, product.base_value, product.association_percentage, product.im_percentage, product.local_percentage, product.association_minimal_value, product.im_minimal_value, product.local_minimal_value, product.currency_id, product.category_id);
        }
        res.send(result);
    }));
    app.post("/api/product_categories", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const product_category = req.body.product_category;
        let result = null;
        if (product_category.id > 0) {
            result = yield DBM.ExecuteSQLNoResults(`update product_category set
                name = @1
            where id = @0`, product_category.id, product_category.name);
        }
        else {
            result = yield DBM.ExecuteSQLNoResults(`insert into product_category
            (name) values (@0)`, product_category.name);
        }
        res.send(result);
    }));
}
exports.routes = routes;
//# sourceMappingURL=products-routes.js.map