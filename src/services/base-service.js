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
const database_manager_1 = require("./managers/database-manager");
const dependency_manager_1 = require("./managers/dependency-manager");
class BaseService {
    get databaseManager() {
        return dependency_manager_1.DependencyManager.container.resolve(database_manager_1.DatabaseManager);
    }
    get queryRunner() {
        return new Promise((resolve) => {
            this.databaseManager
                .CreateQueryRunner()
                .then((queryRunner) => {
                resolve(queryRunner);
            });
        });
    }
    getRepository(type) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.queryRunner).manager.getRepository(type);
        });
    }
    save(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.queryRunner).manager.save(entity);
        });
    }
    create(entityClass, object) {
        return __awaiter(this, void 0, void 0, function* () {
            const manager = (yield this.queryRunner).manager;
            return manager.create(entityClass, object);
        });
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base-service.js.map