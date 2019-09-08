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
const Branch_1 = require("./Branch");
const VoucherType_1 = require("./VoucherType");
let Voucher = class Voucher {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Voucher.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Voucher.prototype, "title", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Voucher.prototype, "url", void 0);
__decorate([
    typeorm_1.ManyToOne(() => VoucherType_1.VoucherType),
    typeorm_1.JoinColumn({ name: "voucher_type" }),
    __metadata("design:type", VoucherType_1.VoucherType)
], Voucher.prototype, "voucher_type", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Voucher.prototype, "youtube_url", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Voucher.prototype, "header_text", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Voucher.prototype, "initials", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Voucher.prototype, "additional_question", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Voucher.prototype, "final_text", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Voucher.prototype, "confirm_button_text", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Voucher.prototype, "header_title", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Voucher.prototype, "anonymous_header_text", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Voucher.prototype, "active", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Voucher.prototype, "order", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Branch_1.Branch),
    typeorm_1.JoinTable({
        name: "branch_voucher",
        joinColumns: [{ name: "voucher_id" }],
        inverseJoinColumns: [{ name: "branch_id" }]
    }),
    __metadata("design:type", Array)
], Voucher.prototype, "branches", void 0);
Voucher = __decorate([
    typeorm_1.Entity()
], Voucher);
exports.Voucher = Voucher;
//# sourceMappingURL=Voucher.js.map