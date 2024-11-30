import { BaseTable } from 'src/common/entity/base-table.entuty';
import { Movie } from 'src/movie/entity/movie.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Genre extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Movie, (movie) => movie.id)
  movies: Movie[];
}