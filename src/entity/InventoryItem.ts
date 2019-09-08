// tslint:disable:variable-name

import {Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "inventory_item"} )
export class InventoryItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    expiration_in_days: number;

    @Column()
    required_for_active_member: boolean;

    @Column()
    required_for_disciple: boolean;

    @Column()
    required_for_operator: boolean;

    @Column()
    required_for_program: boolean;

    @Column()
    require_title: boolean;

    @Column()
    require_size: boolean;

    @Column()
    require_gender: boolean;
}
