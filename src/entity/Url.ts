// tslint:disable:variable-name
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Url {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    url: string;

    @Column()
    require_parameter: boolean;
}