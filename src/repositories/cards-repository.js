"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_manager_1 = require("../services/managers/database-manager");
const trylog_decorator_1 = require("../decorators/trylog-decorator");
const dependency_manager_1 = require("../services/managers/dependency-manager");
class CardsRepository {
    constructor() {
        this.DBM = dependency_manager_1.DependencyManager.container.resolve(database_manager_1.DatabaseManager);
    }
    getOrganizations(id, includeChildrens = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.DBM.ExecuteJsonSP("GetOrganizations", { organization_id: id > 0 ? id : null }, { include_childrens: includeChildrens ? 1 : 0 });
        });
    }
    getProject(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.DBM.ExecuteJsonSP("GetProject", { project_id: id });
        });
    }
}
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CardsRepository.prototype, "getOrganizations", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CardsRepository.prototype, "getProject", null);
exports.CardsRepository = CardsRepository;
//# sourceMappingURL=cards-repository.js.map