import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Person } from "./Person";

@Entity({ name: "password_request"} )
export class PasswordRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Person)
    @JoinColumn({ name: "person_id" })
    person: Person;

    @Column()
    token: string;
}
