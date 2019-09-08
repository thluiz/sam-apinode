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
const InventoryItem_1 = require("./InventoryItem");
const Person_1 = require("./Person");
let PersonalInventory = class PersonalInventory {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], PersonalInventory.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], PersonalInventory.prototype, "title", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], PersonalInventory.prototype, "description", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Person_1.Person),
    typeorm_1.JoinColumn({ name: "person_id" }),
    __metadata("design:type", Person_1.Person)
], PersonalInventory.prototype, "person", void 0);
__decorate([
    typeorm_1.ManyToOne(type => InventoryItem_1.InventoryItem),
    typeorm_1.JoinColumn({ name: "inventory_item_id" }),
    __metadata("design:type", InventoryItem_1.InventoryItem)
], PersonalInventory.prototype, "item", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], PersonalInventory.prototype, "request_date", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], PersonalInventory.prototype, "acknowledge_date", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], PersonalInventory.prototype, "delivery_date", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], PersonalInventory.prototype, "expiration_date", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Person_1.Person),
    typeorm_1.JoinColumn({ name: "acknowledge_by" }),
    __metadata("design:type", Person_1.Person)
], PersonalInventory.prototype, "acknowledge_by", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Person_1.Person),
    typeorm_1.JoinColumn({ name: "requested_by" }),
    __metadata("design:type", Person_1.Person)
], PersonalInventory.prototype, "requested_by", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Person_1.Person),
    typeorm_1.JoinColumn({ name: "delivered_by" }),
    __metadata("design:type", Person_1.Person)
], PersonalInventory.prototype, "delivered_by", void 0);
PersonalInventory = __decorate([
    typeorm_1.Entity({ name: "personal_inventory" }),
    typeorm_1.Entity()
], PersonalInventory);
exports.PersonalInventory = PersonalInventory;
//# sourceMappingURL=PersonalInventory.js.map