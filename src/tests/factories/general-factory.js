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
const User_1 = require("../../entity/User");
const Person_1 = require("../../entity/Person");
function create_user(runner) {
    return __awaiter(this, void 0, void 0, function* () {
        let person = yield create_person(runner);
        let user = new User_1.User();
        user.person = person;
        user.login_provider_id = 1;
        yield runner.manager.save(user);
        return user;
    });
}
exports.create_user = create_user;
function create_responsible(runner) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield create_person(runner);
    });
}
exports.create_responsible = create_responsible;
function create_person(runner) {
    return __awaiter(this, void 0, void 0, function* () {
        let person = new Person_1.Person();
        person.name = "Teste Person";
        yield runner.manager.save(person);
        return person;
    });
}
exports.create_person = create_person;
//# sourceMappingURL=general-factory.js.map