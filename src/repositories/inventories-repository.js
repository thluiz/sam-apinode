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
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const trylog_decorator_1 = require("../decorators/trylog-decorator");
const result_1 = require("../helpers/result");
const base_repository_1 = require("./base-repository");
const InventoryItem_1 = require("../entity/InventoryItem");
class InventoriesRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(InventoryItem_1.InventoryItem);
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = (yield this.createQueryBuilder());
            const result = yield query.getMany();
            return result_1.SuccessResult.GeneralOk(result);
        });
    }
}
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoriesRepository.prototype, "getAll", null);
exports.InventoriesRepository = InventoriesRepository;
//# sourceMappingURL=inventories-repository.js.map