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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Role_1 = require("./Role");
const Url_1 = require("./Url");
let Person = class Person {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Person.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Person.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Person.prototype, "salt", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Person.prototype, "password", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Person.prototype, "is_interested", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Person.prototype, "is_operator", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Person.prototype, "is_director", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Person.prototype, "is_manager", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Person.prototype, "avatar_img", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Person.prototype, "avatar_sm", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Person.prototype, "avatar_md", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Person.prototype, "avatar_esm", void 0);
__decorate([
    typeorm_1.Column({ name: "branch_id" }),
    __metadata("design:type", Number)
], Person.prototype, "branch_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Url_1.Url),
    typeorm_1.JoinColumn({ name: "default_page_id" }),
    __metadata("design:type", Url_1.Url)
], Person.prototype, "default_page", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Role_1.Role, (role) => role.people),
    __metadata("design:type", Array)
], Person.prototype, "roles", void 0);
Person = __decorate([
    typeorm_1.Entity()
], Person);
exports.Person = Person;
//# sourceMappingURL=Person.js.map