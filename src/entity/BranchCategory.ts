import {Entity, PrimaryGeneratedColumn, Column } from "typeorm";


@Entity({ name: "enum_branch_category" })
export class BranchCategory {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    description: string;

    @Column()
    abrev: string;
}