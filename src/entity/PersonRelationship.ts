import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import { Person } from "./Person";
import { EnumRelationshipType } from "./EnumRelationshipType";

@Entity()
export class PersonRelationship {
    @PrimaryGeneratedColumn()
    id: number;    

    @Column()
    identifier: string

    @ManyToOne(type => EnumRelationshipType)
    @JoinColumn({ name: "relationship_type" })
    relationship_type: EnumRelationshipType;

    @Column({name: "monitoring_card_id"})
    card_id: number;    

    @ManyToOne(type => Person)
    @JoinColumn({ name: "person_id" })
    parent_person: Person;

    @ManyToOne(type => Person)
    @JoinColumn({ name: "person2_id" })
    target_person: Person;
}