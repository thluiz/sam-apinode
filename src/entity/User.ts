// tslint:disable:variable-name

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { UsersRepository } from "../repositories/users-repository";
import { Person } from "./Person";

import { tryLogAsync } from "../decorators/trylog-decorator";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    login_provider_id: number;

    @ManyToOne(() => Person)
    @JoinColumn({ name: "person_id" })
    person: Person;

    @Column()
    default_branch_id: number;

    @Column()
    token: string;

    async is_director() {
        await this.loadPersonIfNeeded();
        return this.person.is_director;
    }

    async is_manager() {
        await this.loadPersonIfNeeded();

        return this.person.is_manager;
    }

    async is_operator() {
        await this.loadPersonIfNeeded();

        return this.person.is_operator;
    }

    async getPersonId(): Promise<number> {
        await this.loadPersonIfNeeded();

        return this.person.id;
    }

    async getPerson(cache = true): Promise<Person> {
        await this.loadPersonIfNeeded(cache);

        return this.person;
    }

    @tryLogAsync()
    async loadPersonIfNeeded(cache = true) {
        if (this.person != null) { return; }
        const UR = await new UsersRepository();
        const result_user = cache ?
                                await UR.loadAllUserData(this.id)
                                : await UR.loadAllUserDataWithoutCache(this.id);

        this.person = (result_user.data as User).person;
    }
}
