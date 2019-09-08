// tslint:disable:variable-name

import { Branch } from "./Branch";
import { Card } from "./Card";
import { IncidentType } from "./IncidentType";
import { Location } from "./Location";
import { Person } from "./Person";
import { PersonIncident } from "./PersonIncident";

import { Column, Entity, JoinColumn,
    ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class Incident {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => IncidentType)
    @JoinColumn({ name: "incident_type" })
    type: IncidentType;

    @Column({ type: "datetime", default: () => "getdate()"})
    created_on: Date;

    @Column({ type: "datetime" })
    end_date: Date;

    @Column()
    treated: boolean;

    @Column()
    closed: boolean;

    @Column()
    scheduled: boolean;

    @Column()
    date: Date;

    @Column()
    closed_on: Date;

    @ManyToOne(() => Person)
    @JoinColumn({ name: "closed_by" })
    closed_by: Person;

    @ManyToOne(() => Person)
    @JoinColumn({ name: "responsible_id" })
    responsible: Person;

    @ManyToOne(() => Branch)
    @JoinColumn({ name: "branch_id" })
    branch: Branch;

    @ManyToOne(() => Location)
    @JoinColumn({ name: "location_id" })
    location: Location;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    close_text: string;

    @Column()
    fund_value: number;

    @Column()
    value: number;

    @Column()
    comment_count: number;

    @Column()
    cancelled: boolean;

    @Column()
    cancelled_on: Date;

    @ManyToOne(() => Person)
    @JoinColumn({ name: "cancelled_by" })
    cancelled_by: Person;

    @Column()
    started_on: Date;

    @UpdateDateColumn({
        default: () => "getdate()",
        type: "datetime"
    })
    updated_at: Date;

    @ManyToOne(() => Person)
    @JoinColumn({ name: "started_by" })
    started_by: Person;

    @ManyToOne(() => Card)
    @JoinColumn({ name: "card_id" })
    card_id: Card;

    @Column()
    person_schedule_id: number;

    @Column()
    payment_method_id: number;

    @Column()
    contact_method_id: number;

    @ManyToOne(() => Incident)
    @JoinColumn({ name: "ownership_id" })
    ownership: Incident;

    @OneToMany(() => PersonIncident, (person_incident) => person_incident.incident, { cascade: true })
    people_incidents: PersonIncident[];

    @Column()
    define_fund_value: boolean;

    // tslint:disable-next-line:member-ordering
    static duplicate(data: Incident): Incident {
        // Object.assign does not work as expected
        const incident = new Incident();
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
}
