import {Entity, PrimaryGeneratedColumn, Column } from "typeorm";


@Entity({ name: "enum_voucher_type" })
export class VoucherType {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;
}