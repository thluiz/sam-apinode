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
const Incident_1 = require("./Incident");
const Person_1 = require("./Person");
let PersonIncident = PersonIncident_1 = class PersonIncident {
    static create(incident, person) {
        const result = new PersonIncident_1();
        result.closed = false;
        result.participation_type = 1;
        result.incident = incident;
        result.person = person;
        return result;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], PersonIncident.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Person_1.Person),
    typeorm_1.JoinColumn({ name: "person_id" }),
    __metadata("design:type", Person_1.Person)
], PersonIncident.prototype, "person", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Incident_1.Incident, incident => incident.people_incidents),
    typeorm_1.JoinColumn({ name: "incident_id" }),
    __metadata("design:type", Incident_1.Incident)
], PersonIncident.prototype, "incident", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], PersonIncident.prototype, "participation_type", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], PersonIncident.prototype, "closed", void 0);
PersonIncident = PersonIncident_1 = __decorate([
    typeorm_1.Entity()
], PersonIncident);
exports.PersonIncident = PersonIncident;
var PersonIncident_1;
//# sourceMappingURL=PersonIncident.js.map