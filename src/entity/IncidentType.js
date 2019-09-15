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
var IncidentType_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
let IncidentType = IncidentType_1 = class IncidentType {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], IncidentType.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], IncidentType.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], IncidentType.prototype, "abrev", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], IncidentType.prototype, "obrigatory", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], IncidentType.prototype, "need_value", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], IncidentType.prototype, "active", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], IncidentType.prototype, "order", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], IncidentType.prototype, "need_description_for_closing", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], IncidentType.prototype, "activity_type", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], IncidentType.prototype, "show_hour_in_diary", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], IncidentType.prototype, "automatically_generated", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], IncidentType.prototype, "need_start_hour_minute", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], IncidentType.prototype, "need_to_be_started", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], IncidentType.prototype, "allowed_for_new_person", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], IncidentType.prototype, "financial_type", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], IncidentType.prototype, "use_in_map", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], IncidentType.prototype, "require_title", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], IncidentType.prototype, "require_payment_method", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], IncidentType.prototype, "require_contact_method", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], IncidentType.prototype, "need_fund_value", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], IncidentType.prototype, "require_ownership", void 0);
__decorate([
    typeorm_1.ManyToOne(type => IncidentType_1),
    typeorm_1.JoinColumn({ name: "parent_id" }),
    __metadata("design:type", IncidentType)
], IncidentType.prototype, "parent", void 0);
IncidentType = IncidentType_1 = __decorate([
    typeorm_1.Entity({ name: "enum_incident_type" })
], IncidentType);
exports.IncidentType = IncidentType;
//# sourceMappingURL=IncidentType.js.map