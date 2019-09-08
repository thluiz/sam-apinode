import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Branch } from "./Branch";
import { Country } from "./Country";

@Entity()
export class Location {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToOne(() => Country)
    @JoinColumn({ name: "country_id" })
    country: Country;

    @ManyToOne(() => Branch)
    @JoinColumn({ name: "branch_id" })
    branch: Branch;

    @Column()
    active: boolean;

    @Column()
    order: number;
}
