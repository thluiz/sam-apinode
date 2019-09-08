import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity({ name: "enum_incident_type" })
export class IncidentType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    abrev: string;

    @Column()
    obrigatory: boolean;

    @Column()
    need_value: boolean;

    @Column()
    active: boolean;

    @Column()
    order: number;

    @Column()
    need_description_for_closing: boolean;

    @Column()
    activity_type: number;

    @Column()
    show_hour_in_diary: boolean;

    @Column()
    automatically_generated: boolean;

    @Column()
    need_start_hour_minute: boolean;

    @Column()
    need_to_be_started: boolean;

    @Column()
    allowed_for_new_person: boolean;

    @Column()
    financial_type: number;

    @Column()
    use_in_map: boolean;

    @Column()
    require_title: boolean;

    @Column()
    require_payment_method: boolean;

    @Column()
    require_contact_method: boolean;

    @Column()
    need_fund_value: boolean;

    @Column()
    require_ownership: boolean;

    @ManyToOne(type => IncidentType)
    @JoinColumn({ name: "parent_id" })
    parent: IncidentType;
}