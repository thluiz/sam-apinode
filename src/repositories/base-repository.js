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
const dependency_manager_1 = require("../services/managers/dependency-manager");
const trylog_decorator_1 = require("../decorators/trylog-decorator");
class BaseRepository {
    constructor(type) {
        this.DBM = dependency_manager_1.DependencyManager.container.resolve(database_manager_1.DatabaseManager);
        this.type = type;
    }
    getRepository() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.internalRepository) {
                this.internalRepository = yield this.DBM.getRepository(this.type);
            }
            return this.internalRepository;
        });
    }
    createQueryBuilder() {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = yield this.getRepository();
            return repo.createQueryBuilder();
        });
    }
}
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BaseRepository.prototype, "getRepository", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BaseRepository.prototype, "createQueryBuilder", null);
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base-repository.js.map