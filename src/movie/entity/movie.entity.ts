import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
@Entity()
export class Movie {
  @PrimaryColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  genre: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @VersionColumn()
  vsersion: number;
}
