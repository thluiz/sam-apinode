"use strict";
// tslint:disable:variable-name
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
const typeorm_1 = require("typeorm");
const users_repository_1 = require("../repositories/users-repository");
const Person_1 = require("./Person");
const trylog_decorator_1 = require("../decorators/trylog-decorator");
let User = class User {
    is_director() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadPersonIfNeeded();
            return this.person.is_director;
        });
    }
    is_manager() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadPersonIfNeeded();
            return this.person.is_manager;
        });
    }
    is_operator() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadPersonIfNeeded();
            return this.person.is_operator;
        });
    }
    getPersonId() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadPersonIfNeeded();
            return this.person.id;
        });
    }
    getPerson(cache = true) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadPersonIfNeeded(cache);
            return this.person;
        });
    }
    loadPersonIfNeeded(cache = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.person != null) {
                return;
            }
            const UR = yield new users_repository_1.UsersRepository();
            const result_user = cache ?
                yield UR.loadAllUserData(this.id)
                : yield UR.loadAllUserDataWithoutCache(this.id);
            this.person = result_user.data.person;
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], User.prototype, "login_provider_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Person_1.Person),
    typeorm_1.JoinColumn({ name: "person_id" }),
    __metadata("design:type", Person_1.Person)
], User.prototype, "person", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], User.prototype, "default_branch_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "token", void 0);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], User.prototype, "loadPersonIfNeeded", null);
User = __decorate([
    typeorm_1.Entity()
], User);
exports.User = User;
//# sourceMappingURL=User.js.map