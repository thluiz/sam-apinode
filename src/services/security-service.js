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
const crypto = require("crypto");
const PasswordRequest_1 = require("../entity/PasswordRequest");
const Person_1 = require("../entity/Person");
const User_1 = require("../entity/User");
const users_repository_1 = require("../repositories/users-repository");
const trylog_decorator_1 = require("../decorators/trylog-decorator");
const base_service_1 = require("./base-service");
const errors_codes_1 = require("../helpers/errors-codes");
const result_1 = require("../helpers/result");
const utils_service_1 = require("./utils-service");
const password_request_report_1 = require("./reports/password-request-report");
var Permissions;
(function (Permissions) {
    Permissions[Permissions["Operator"] = 0] = "Operator";
    Permissions[Permissions["Manager"] = 1] = "Manager";
    Permissions[Permissions["Director"] = 2] = "Director";
})(Permissions = exports.Permissions || (exports.Permissions = {}));
class SecurityService extends base_service_1.BaseService {
    constructor() {
        super(...arguments);
        this.UR = new users_repository_1.UsersRepository();
    }
    static sha512(password, salt) {
        const s = salt || utils_service_1.UtilsService.genRandomString(120);
        const hash = crypto.createHmac("sha512", s.toString());
        hash.update(password);
        const value = hash.digest("hex");
        return {
            salt,
            passwordHash: value
        };
    }
    serializeUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user == null) {
                return null;
            }
            yield user.loadPersonIfNeeded();
            const response = {
                name: user.person.name,
                is_director: user.is_director,
                is_manager: user.is_manager,
                is_operator: user.is_operator,
                avatar_img: user.person.avatar_img,
                person_id: user.person.id,
                email: user.email,
                token: user.token,
                default_branch_id: user.default_branch_id
            };
            if (user.person.default_page != null) {
                response.default_page_id = user.person.default_page.id[0];
                response.default_page = user.person.default_page.name;
                response.default_page_url = user.person.default_page.url;
            }
            return response;
        });
    }
    resetPassword(token, password, confirm) {
        return __awaiter(this, void 0, void 0, function* () {
            if (password !== confirm) {
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, new Error("Por favor, confirme a senha"));
            }
            const PRR = yield this.databaseManager.getRepository(PasswordRequest_1.PasswordRequest);
            const PR = yield this.databaseManager.getRepository(Person_1.Person);
            const pr = yield PRR.manager
                .createQueryBuilder(PasswordRequest_1.PasswordRequest, "pr")
                .innerJoinAndSelect("pr.person", "p")
                .where("pr.token = :token", { token })
                .getOne();
            if (!pr) {
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, new Error("Token não encontrado ou já utilizado. Solicite um novo."));
            }
            const validatePassword = this.validatePassword(password);
            if (!validatePassword.success) {
                return validatePassword;
            }
            const person = pr.person;
            person.salt = utils_service_1.UtilsService.genRandomString(120);
            person.password = SecurityService.sha512(password, person.salt).passwordHash;
            yield PR.save(person);
            yield PRR.delete(pr);
            return result_1.SuccessResult.GeneralOk();
        });
    }
    createPasswordRequest(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const PRR = yield this.databaseManager.getRepository(PasswordRequest_1.PasswordRequest);
            const resultUser = yield this.UR.getUserByEmail(email);
            if (!resultUser || !resultUser.success || !resultUser.data) {
                return result_1.SuccessResult.GeneralOk();
            }
            const person = yield resultUser.data.getPerson();
            const passwordRequest = new PasswordRequest_1.PasswordRequest();
            passwordRequest.person = person;
            passwordRequest.token = utils_service_1.UtilsService.genRandomString(10);
            try {
                yield PRR.save(passwordRequest);
            }
            catch (error) {
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
            try {
                const emailRequest = new password_request_report_1.PasswordRequestReport();
                emailRequest.send(resultUser.data, passwordRequest);
            }
            catch (error) {
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.SendingEmail, error);
            }
            return result_1.SuccessResult.GeneralOk();
        });
    }
    getUserFromRequest(req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.PRODUCTION === "false") {
                const loadUser = yield this.UR.getUserByToken(process.env.TOKEN_USER_DEV);
                return loadUser.data;
            }
            return req.user;
        });
    }
    checkUserHasPermission(user, permission) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user == null || permission == null) {
                return false;
            }
            let hasPermission = false;
            switch (permission) {
                case Permissions.Operator:
                    hasPermission =
                        (yield user.is_operator()) ||
                            (yield user.is_director()) ||
                            (yield user.is_manager());
                    break;
                case Permissions.Manager:
                    hasPermission = (yield user.is_director()) || (yield user.is_manager());
                    break;
                case Permissions.Director:
                    hasPermission = yield user.is_director();
                    break;
            }
            return hasPermission;
        });
    }
    findUser(email, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const loadUser = yield this.UR.getUserByEmail(email);
            const user = loadUser.data;
            if (!user) {
                callback(null, false);
                return;
            }
            callback(null, user);
        });
    }
    findUserByToken(token, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const loadUser = yield this.UR.getUserByToken(token);
            const user = loadUser.data;
            if (!user) {
                if (callback) {
                    callback("user not fount", false);
                }
                return;
            }
            if (callback) {
                callback(null, user);
            }
            return user;
        });
    }
    validatePassword(password) {
        if (password.lengh < 8) {
            return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, new Error("Informe ao menos 8 caracteres para senha"));
        }
        if (password.lengh > 16) {
            return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, new Error("Informe menos de 16 caracteres para senha"));
        }
        const hasUpperCase = /[A-Z]/.test(password) ? 1 : 0;
        const hasLowerCase = /[a-z]/.test(password) ? 1 : 0;
        const hasNumbers = /\d/.test(password) ? 1 : 0;
        const hasNonalphas = /\W/.test(password) ? 1 : 0;
        if (hasUpperCase + hasLowerCase + hasNumbers + hasNonalphas < 3) {
            return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, new Error("A senha deve possuir algum número, caracter especial, letras maiúsculas ou minúsculas"));
        }
        return result_1.SuccessResult.GeneralOk();
    }
}
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User]),
    __metadata("design:returntype", Promise)
], SecurityService.prototype, "serializeUser", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityService.prototype, "resetPassword", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityService.prototype, "createPasswordRequest", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityService.prototype, "getUserFromRequest", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User, Number]),
    __metadata("design:returntype", Promise)
], SecurityService.prototype, "checkUserHasPermission", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityService.prototype, "findUser", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SecurityService.prototype, "findUserByToken", null);
exports.SecurityService = SecurityService;
//# sourceMappingURL=security-service.js.map