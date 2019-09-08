import {Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Currency {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;

    @Column()
    symbol: string;         
} 