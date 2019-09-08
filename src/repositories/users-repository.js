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
const User_1 = require("../entity/User");
const base_repository_1 = require("./base-repository");
const cache_decorator_1 = require("../decorators/cache-decorator");
const trylog_decorator_1 = require("../decorators/trylog-decorator");
const result_1 = require("../helpers/result");
class UsersRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(User_1.User);
    }
    loadAllUserData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const UR = yield this.getRepository();
            const user = yield UR.manager
                .createQueryBuilder(User_1.User, "u")
                .innerJoinAndSelect("u.person", "p")
                .leftJoinAndSelect("p.default_page", "dp")
                .where("u.id = :id", { id: userId })
                .cache(10000)
                .getOne();
            return result_1.SuccessResult.GeneralOk(user);
        });
    }
    loadAllUserDataWithoutCache(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const UR = yield this.getRepository();
            const user = yield UR.manager
                .createQueryBuilder(User_1.User, "u")
                .innerJoinAndSelect("u.person", "p")
                .leftJoinAndSelect("p.default_page", "dp")
                .where("u.id = :id", { id: userId })
                .getOne();
            return result_1.SuccessResult.GeneralOk(user);
        });
    }
    getUserByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const UR = yield this.getRepository();
            const user = yield UR.manager
                .createQueryBuilder(User_1.User, "u")
                .where("u.token = :token", { token })
                .cache(10000)
                .getOne();
            return result_1.SuccessResult.GeneralOk(user);
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const UR = yield this.getRepository();
            const user = yield UR.manager
                .createQueryBuilder(User_1.User, "u")
                .where("u.email = :email", { email })
                .cache(10000)
                .getOne();
            return result_1.SuccessResult.GeneralOk(user);
        });
    }
    getUserByEmailWithoutCache(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const UR = yield this.getRepository();
            const user = yield UR.manager
                .createQueryBuilder(User_1.User, "u")
                .where("u.email = :email", { email })
                .getOne();
            return result_1.SuccessResult.GeneralOk(user);
        });
    }
}
__decorate([
    cache_decorator_1.cache(true),
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersRepository.prototype, "loadAllUserData", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersRepository.prototype, "loadAllUserDataWithoutCache", null);
__decorate([
    cache_decorator_1.cache(true),
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersRepository.prototype, "getUserByToken", null);
__decorate([
    cache_decorator_1.cache(true),
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersRepository.prototype, "getUserByEmail", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersRepository.prototype, "getUserByEmailWithoutCache", null);
exports.UsersRepository = UsersRepository;
//# sourceMappingURL=users-repository.js.map