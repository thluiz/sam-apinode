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
const Card_1 = require("./Card");
const Person_1 = require("./Person");
const PersonCardPosition_1 = require("./PersonCardPosition");
let PersonCard = class PersonCard {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], PersonCard.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Person_1.Person),
    typeorm_1.JoinColumn({ name: "person_id" }),
    __metadata("design:type", Person_1.Person)
], PersonCard.prototype, "person", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Card_1.Card),
    typeorm_1.JoinColumn({ name: "card_id" }),
    __metadata("design:type", Card_1.Card)
], PersonCard.prototype, "card", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], PersonCard.prototype, "position_description", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Card_1.Card),
    typeorm_1.JoinColumn({ name: "position" }),
    __metadata("design:type", PersonCardPosition_1.PersonCardPosition)
], PersonCard.prototype, "position", void 0);
PersonCard = __decorate([
    typeorm_1.Entity({ name: "person_card" })
], PersonCard);
exports.PersonCard = PersonCard;
//# sourceMappingURL=PersonCard.js.map