import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { InventoryItem } from "./InventoryItem";
import { Person } from "./Person";

@Entity({ name: "personal_inventory"} )
@Entity()
export class PersonalInventory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @ManyToOne(type => Person)
    @JoinColumn({ name: "person_id" })
    person: Person;

    @ManyToOne(type => InventoryItem)
    @JoinColumn({ name: "inventory_item_id" })
    item: InventoryItem;

    @Column()
    request_date: Date;

    @Column()
    acknowledge_date: Date;

    @Column()
    delivery_date: Date;

    @Column()
    expiration_date: Date;

    @ManyToOne(type => Person)
    @JoinColumn({ name: "acknowledge_by" })
    acknowledge_by: Person;

    @ManyToOne(type => Person)
    @JoinColumn({ name: "requested_by" })
    requested_by: Person;

    @ManyToOne(type => Person)
    @JoinColumn({ name: "delivered_by" })
    delivered_by: Person;
}
