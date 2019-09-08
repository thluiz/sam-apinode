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
let InventoryItem = class InventoryItem {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], InventoryItem.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], InventoryItem.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], InventoryItem.prototype, "expiration_in_days", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], InventoryItem.prototype, "required_for_active_member", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], InventoryItem.prototype, "required_for_disciple", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], InventoryItem.prototype, "required_for_operator", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], InventoryItem.prototype, "required_for_program", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], InventoryItem.prototype, "require_title", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], InventoryItem.prototype, "require_size", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], InventoryItem.prototype, "require_gender", void 0);
InventoryItem = __decorate([
    typeorm_1.Entity({ name: "inventory_item" })
], InventoryItem);
exports.InventoryItem = InventoryItem;
//# sourceMappingURL=InventoryItem.js.map