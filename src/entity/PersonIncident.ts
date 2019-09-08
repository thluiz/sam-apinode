import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Incident } from "./Incident";
import { Person } from "./Person";

@Entity()
export class PersonIncident {

    static create(incident: Incident, person: Person): PersonIncident {
        const result = new PersonIncident();
        result.closed = false;
        result.participation_type = 1;
        result.incident = incident;
        result.person = person;
        return result;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Person)
    @JoinColumn({ name: "person_id" })
    person: Person;

    @ManyToOne(type => Incident, incident => incident.people_incidents)
    @JoinColumn({ name: "incident_id" })
    incident: Incident;

    @Column()
    participation_type: number;

    @Column()
    closed: boolean;

}
