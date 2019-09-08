import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import { Person } from "./Person";

@Entity()
export class EnumRelationshipType {
    @PrimaryGeneratedColumn()
    id: number;    

    @Column()
    name: string;

    @Column()
    feminine_treatment: string;

    @Column()
    masculine_treatment: string;
}