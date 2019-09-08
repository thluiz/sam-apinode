import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Timezone {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    gmt_variation: number;

}