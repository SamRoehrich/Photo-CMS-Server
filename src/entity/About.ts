import { BaseEntity, PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity()
export class About extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;
}
