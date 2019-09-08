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
const EnumRelationshipType_1 = require("./EnumRelationshipType");
let PersonRelationship = class PersonRelationship {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], PersonRelationship.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], PersonRelationship.prototype, "identifier", void 0);
__decorate([
    typeorm_1.ManyToOne(type => EnumRelationshipType_1.EnumRelationshipType),
    typeorm_1.JoinColumn({ name: "relationship_type" }),
    __metadata("design:type", EnumRelationshipType_1.EnumRelationshipType)
], PersonRelationship.prototype, "relationship_type", void 0);
__decorate([
    typeorm_1.Column({ name: "monitoring_card_id" }),
    __metadata("design:type", Number)
], PersonRelationship.prototype, "card_id", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Person_1.Person),
    typeorm_1.JoinColumn({ name: "person_id" }),
    __metadata("design:type", Person_1.Person)
], PersonRelationship.prototype, "parent_person", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Person_1.Person),
    typeorm_1.JoinColumn({ name: "person2_id" }),
    __metadata("design:type", Person_1.Person)
], PersonRelationship.prototype, "target_person", void 0);
PersonRelationship = __decorate([
    typeorm_1.Entity()
], PersonRelationship);
exports.PersonRelationship = PersonRelationship;
//# sourceMappingURL=PersonRelationship.js.map