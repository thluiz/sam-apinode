// tslint:disable:variable-name

import {Column, Entity, JoinColumn,
        ManyToMany, ManyToOne,
        PrimaryGeneratedColumn
} from "typeorm";

import { Incident } from "./Incident";
import { Role } from "./Role";
import { Url } from "./Url";

@Entity()
export class Person {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    salt: string;

    @Column()
    password: string;

    @Column()
    is_interested: boolean;

    @Column()
    is_operator: boolean;

    @Column()
    is_director: boolean;

    @Column()
    is_manager: boolean;

    @Column()
    avatar_img: string;

    @Column()
    avatar_sm: boolean;

    @Column()
    avatar_md: boolean;

    @Column()
    avatar_esm: boolean;

    @Column({name: "branch_id"})
    branch_id: number;

    @ManyToOne(() => Url)
    @JoinColumn({ name: "default_page_id" })
    default_page: Url;

    @ManyToMany(() => Role, (role) => role.people)
    roles: Role[];

    incidents: Incident[];
}
