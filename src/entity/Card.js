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
const Person_1 = require("./Person");
const Location_1 = require("./Location");
let Card = class Card {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Card.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Card.prototype, "title", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Card.prototype, "abrev", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Card.prototype, "order", void 0);
__decorate([
    typeorm_1.Column({ name: "card_template_id" }),
    __metadata("design:type", Number)
], Card.prototype, "card_template_id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Card.prototype, "created_on", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Card.prototype, "archived", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Card.prototype, "automatically_generated", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Card.prototype, "cancelled", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Person_1.Person),
    typeorm_1.JoinColumn({ name: "leader_id" }),
    __metadata("design:type", Person_1.Person)
], Card.prototype, "leader", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Location_1.Location),
    typeorm_1.JoinColumn({ name: "location_id" }),
    __metadata("design:type", Location_1.Location)
], Card.prototype, "location", void 0);
Card = __decorate([
    typeorm_1.Entity()
], Card);
exports.Card = Card;
//# sourceMappingURL=Card.js.map