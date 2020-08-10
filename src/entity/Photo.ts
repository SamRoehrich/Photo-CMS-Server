import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  BeforeInsert,
  getRepository,
} from "typeorm";

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
  borderWidth: number;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ nullable: true })
  tagIndex: number;
  //remove nullable in production
  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true })
  cloudLocation: string;

  @BeforeInsert()
  async addTagIndex() {
    const photoReop = getRepository(Photo);
    const photosByTag = await photoReop.find({ where: { tag: this.tag } });
    this.tagIndex = photosByTag.length;
  }
}
