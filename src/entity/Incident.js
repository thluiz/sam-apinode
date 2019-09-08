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
const Branch_1 = require("./Branch");
const Card_1 = require("./Card");
const IncidentType_1 = require("./IncidentType");
const Location_1 = require("./Location");
const Person_1 = require("./Person");
const PersonIncident_1 = require("./PersonIncident");
const typeorm_1 = require("typeorm");
let Incident = Incident_1 = class Incident {
    // tslint:disable-next-line:member-ordering
    static duplicate(data) {
        // Object.assign does not work as expected
        const incident = new Incident_1();
        incident.branch = data.branch;
        incident.cancelled = data.cancelled;
        incident.cancelled_by = data.cancelled_by;
        incident.cancelled_on = data.cancelled_on;
        incident.card_id = data.card_id;
        incident.close_text = data.close_text;
        incident.closed = data.closed;
        incident.closed_by = data.closed_by;
        incident.closed_on = data.closed_on;
        incident.comment_count = data.comment_count;
        incident.contact_method_id = data.contact_method_id;
        incident.created_on = data.created_on;
        incident.date = data.date;
        incident.define_fund_value = data.define_fund_value;
        incident.description = data.description;
        incident.fund_value = data.fund_value;
        incident.ownership = data.ownership;
        incident.payment_method_id = data.payment_method_id;
        incident.people_incidents = data.people_incidents;
        incident.person_schedule_id = data.person_schedule_id;
        incident.responsible = data.responsible;
        incident.scheduled = data.scheduled;
        incident.started_by = data.started_by;
        incident.started_on = data.started_on;
        incident.title = data.title;
        incident.treated = data.treated;
        incident.type = data.type;
        incident.updated_at = data.updated_at;
        incident.value = data.value;
        return incident;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Incident.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => IncidentType_1.IncidentType),
    typeorm_1.JoinColumn({ name: "incident_type" }),
    __metadata("design:type", IncidentType_1.IncidentType)
], Incident.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({ type: "datetime", default: () => "getdate()" }),
    __metadata("design:type", Date)
], Incident.prototype, "created_on", void 0);
__decorate([
    typeorm_1.Column({ type: "datetime" }),
    __metadata("design:type", Date)
], Incident.prototype, "end_date", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Incident.prototype, "treated", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Incident.prototype, "closed", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Incident.prototype, "scheduled", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Incident.prototype, "date", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Incident.prototype, "closed_on", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Person_1.Person),
    typeorm_1.JoinColumn({ name: "closed_by" }),
    __metadata("design:type", Person_1.Person)
], Incident.prototype, "closed_by", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Person_1.Person),
    typeorm_1.JoinColumn({ name: "responsible_id" }),
    __metadata("design:type", Person_1.Person)
], Incident.prototype, "responsible", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Branch_1.Branch),
    typeorm_1.JoinColumn({ name: "branch_id" }),
    __metadata("design:type", Branch_1.Branch)
], Incident.prototype, "branch", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Location_1.Location),
    typeorm_1.JoinColumn({ name: "location_id" }),
    __metadata("design:type", Location_1.Location)
], Incident.prototype, "location", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Incident.prototype, "title", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Incident.prototype, "description", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Incident.prototype, "close_text", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Incident.prototype, "fund_value", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Incident.prototype, "value", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Incident.prototype, "comment_count", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Incident.prototype, "cancelled", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Incident.prototype, "cancelled_on", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Person_1.Person),
    typeorm_1.JoinColumn({ name: "cancelled_by" }),
    __metadata("design:type", Person_1.Person)
], Incident.prototype, "cancelled_by", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Incident.prototype, "started_on", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({
        default: () => "getdate()",
        type: "datetime"
    }),
    __metadata("design:type", Date)
], Incident.prototype, "updated_at", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Person_1.Person),
    typeorm_1.JoinColumn({ name: "started_by" }),
    __metadata("design:type", Person_1.Person)
], Incident.prototype, "started_by", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Card_1.Card),
    typeorm_1.JoinColumn({ name: "card_id" }),
    __metadata("design:type", Card_1.Card)
], Incident.prototype, "card_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Incident.prototype, "person_schedule_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Incident.prototype, "payment_method_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Incident.prototype, "contact_method_id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Incident_1),
    typeorm_1.JoinColumn({ name: "ownership_id" }),
    __metadata("design:type", Incident)
], Incident.prototype, "ownership", void 0);
__decorate([
    typeorm_1.OneToMany(() => PersonIncident_1.PersonIncident, (person_incident) => person_incident.incident, { cascade: true }),
    __metadata("design:type", Array)
], Incident.prototype, "people_incidents", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Incident.prototype, "define_fund_value", void 0);
Incident = Incident_1 = __decorate([
    typeorm_1.Entity()
], Incident);
exports.Incident = Incident;
var Incident_1;
//# sourceMappingURL=Incident.js.map