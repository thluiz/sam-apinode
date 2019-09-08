// tslint:disable:variable-name

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { BranchCategory } from "./BranchCategory";
import { Currency } from "./Currency";
import { Location } from "./Location";
import { Timezone } from "./Timezone";

@Entity()
export class Branch {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    abrev: string;

    @Column()
    initials: string;

    @ManyToOne(() => BranchCategory)
    @JoinColumn({ name: "category_id" })
    category: BranchCategory;

    @ManyToOne(() => Location)
    @JoinColumn({ name: "location_id" })
    location: Location;

    @ManyToOne(() => Currency)
    @JoinColumn({ name: "default_currency_id" })
    default_currency: Currency;

    @ManyToOne(() => Timezone)
    @JoinColumn({ name: "timezone_id" })
    timezone: Timezone;

    @Column()
    active: boolean;

    @Column()
    has_voucher: boolean;

    @Column()
    order: number;

    @Column()
    contact_phone: string;

    @Column()
    contact_email: string;
}
