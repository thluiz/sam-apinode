import {Entity, PrimaryGeneratedColumn, Column, 
    ManyToOne, JoinColumn, ManyToMany, CreateDateColumn } from "typeorm";
import { Person } from "./Person";
import { Location } from "./Location";

@Entity()
export class Card {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    title: string;

    @Column()
    abrev: string;

    @Column()
    order: number;

    @Column({name: "card_template_id"})
    card_template_id: number;

    @CreateDateColumn()
    created_on: Date

    @Column()
    archived: boolean;

    @Column()
    automatically_generated: boolean;

    @Column()
    cancelled: boolean;

    @ManyToOne(type => Person)
    @JoinColumn({ name: "leader_id" })
    leader: Person;
        
    @ManyToOne(type => Location)
    @JoinColumn({ name: "location_id" })
    location: Location;
} 