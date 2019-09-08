import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Currency } from "./Currency";

@Entity()
export class Country {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;
    
    @Column()
    order: number;

    @ManyToOne(type => Currency)
    @JoinColumn({ name: "currency_id" })
    currency: Currency;
}