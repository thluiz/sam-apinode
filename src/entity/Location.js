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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Branch_1 = require("./Branch");
const Country_1 = require("./Country");
let Location = class Location {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Location.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Location.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Location.prototype, "description", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Country_1.Country),
    typeorm_1.JoinColumn({ name: "country_id" }),
    __metadata("design:type", Country_1.Country)
], Location.prototype, "country", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Branch_1.Branch),
    typeorm_1.JoinColumn({ name: "branch_id" }),
    __metadata("design:type", Branch_1.Branch)
], Location.prototype, "branch", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Location.prototype, "active", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Location.prototype, "order", void 0);
Location = __decorate([
    typeorm_1.Entity()
], Location);
exports.Location = Location;
//# sourceMappingURL=Location.js.map