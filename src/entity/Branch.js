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
const BranchCategory_1 = require("./BranchCategory");
const Currency_1 = require("./Currency");
const Location_1 = require("./Location");
const Timezone_1 = require("./Timezone");
let Branch = class Branch {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Branch.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Branch.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Branch.prototype, "abrev", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Branch.prototype, "initials", void 0);
__decorate([
    typeorm_1.ManyToOne(() => BranchCategory_1.BranchCategory),
    typeorm_1.JoinColumn({ name: "category_id" }),
    __metadata("design:type", BranchCategory_1.BranchCategory)
], Branch.prototype, "category", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Location_1.Location),
    typeorm_1.JoinColumn({ name: "location_id" }),
    __metadata("design:type", Location_1.Location)
], Branch.prototype, "location", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Currency_1.Currency),
    typeorm_1.JoinColumn({ name: "default_currency_id" }),
    __metadata("design:type", Currency_1.Currency)
], Branch.prototype, "default_currency", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Timezone_1.Timezone),
    typeorm_1.JoinColumn({ name: "timezone_id" }),
    __metadata("design:type", Timezone_1.Timezone)
], Branch.prototype, "timezone", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Branch.prototype, "active", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Branch.prototype, "has_voucher", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Branch.prototype, "order", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Branch.prototype, "contact_phone", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Branch.prototype, "contact_email", void 0);
Branch = __decorate([
    typeorm_1.Entity()
], Branch);
exports.Branch = Branch;
//# sourceMappingURL=Branch.js.map