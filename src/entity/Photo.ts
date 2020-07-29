import { BaseEntity, PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity()
export class Photo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  tag: string;

  @Column()
  isActive: boolean;

  @Column({ nullable: true })
  width: number;

  @Column({ nullable: true })
  thumbnail: string;

  //remove nullable in production
  @Column({ nullable: true })
  link: string;
}
