import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Card } from "./Card";
import { Person } from "./Person";
import { PersonCardPosition } from "./PersonCardPosition";

@Entity({ name: "person_card"} )
export class PersonCard {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Person)
    @JoinColumn({ name: "person_id" })
    person: Person;

    @ManyToOne(type => Card)
    @JoinColumn({ name: "card_id" })
    card: Card;

    @Column()
    position_description: string;

    @ManyToOne(type => Card)
    @JoinColumn({ name: "position" })
    position: PersonCardPosition;

}
