import {Entity, PrimaryGeneratedColumn, Column } from "typeorm";


@Entity({ name: "person_card_position" })
export class PersonCardPosition {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;

    @Column()
    hierarchical: boolean;

    @Column()
    active: boolean;
}