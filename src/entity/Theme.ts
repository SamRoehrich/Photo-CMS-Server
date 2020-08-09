import { BaseEntity, PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity()
export class Theme extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  primaryColor: string;

  @Column()
  secondaryColor: string;

  @Column()
  tertiaryColor: string;

  @Column()
  ascentColor: string;

  @Column()
  backgroundColor: string;

  @Column()
  textPrimaryColor: string;

  @Column()
  textSecondaryColor: string;
}
