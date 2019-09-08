import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Person } from './Person';

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(type => Person, person => person.roles)
    @JoinTable({
        name: "person_role",
        joinColumns : [ {name: "role_id" }],
        inverseJoinColumns: [{name: "person_id"}]
    })
    people: Person[];
}