// tslint:disable:variable-name

import {Column, Entity, JoinColumn, JoinTable,
    ManyToMany, ManyToOne, PrimaryGeneratedColumn
} from "typeorm";
import { Branch } from "./Branch";
import { VoucherType } from "./VoucherType";

@Entity()
export class Voucher {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    url: string;

    @ManyToOne(() => VoucherType)
    @JoinColumn({ name: "voucher_type" })
    voucher_type: VoucherType;

    @Column()
    youtube_url: string;

    @Column()
    header_text: string;

    @Column()
    initials: string;

    @Column()
    additional_question: string;

    @Column()
    final_text: string;

    @Column()
    confirm_button_text: string;

    @Column()
    header_title: string;

    @Column()
    anonymous_header_text: string;

    @Column()
    active: boolean;

    @Column()
    order: number;

    @ManyToMany(() => Branch)
    @JoinTable({
        name: "branch_voucher",
        joinColumns : [ {name: "voucher_id" }],
        inverseJoinColumns: [{name: "branch_id"}]
    })
    branches: Branch[];
}
