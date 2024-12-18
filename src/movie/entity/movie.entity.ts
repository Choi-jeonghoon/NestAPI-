import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTable } from '../../common/entity/base-table.entuty';
import { MovieDetail } from './movie-detail.entity';
import { Director } from 'src/director/entity/director.entity';
import { Genre } from 'src/genre/entity/genre.entity';

// ManyToOne Director -> 감독은 여러개의 영화를 만들수 있음
// OneToOne MovieDetail -> 영화는 하나의 상세 내용을 갖을 수 있음
// ManyToMany genre-> 영화는 여러개의 장르를 갖을수 있으면 장라는 여러개의 영화에 속할수 있음

@Entity()
//아래는 코드는 상속 받아 처리는 것이다
export class Movie extends BaseTable {
  //   @PrimaryGeneratedColumn()
  //   id: number;

  //   @Column()
  //   title: string;

  //   @Column()
  //   genre: string;
  @PrimaryGeneratedColumn()
  id: number;

  //QueryFailedError: duplicate key value violates unique constraint "UQ_a81090ad0ceb645f30f9399c347"
  //유니크 제약을 넣어준상태로 조건을 준것이다. 제약을 벗어날려고하면 위와같은 에러가 발생
  @Column({
    unique: true,
  })
  title: string;

  @ManyToMany(() => Genre, (genre) => genre.movies)
  @JoinTable()
  genres: Genre[];

  @OneToOne(() => MovieDetail, (movieDetail) => movieDetail.id, {
    cascade: true,
    nullable: false, // null 변경을 막기위함
  })
  @JoinColumn()
  detail: MovieDetail;

  @ManyToOne(() => Director, (director) => director.id, {
    cascade: true,
    nullable: false, // null 변경을 막기위함
  })
  director: Director;
}
/*결과 반환되는 모습

[
    [
        {
            "createdAt": "2024-10-25T12:38:44.392Z",
            "updateAt": "2024-10-25T12:38:44.392Z",
            "vsersion": 1,
            "id": 2,
            "title": "반지의 제왕1",
            "genre": "AC"
        },
        {
            "createdAt": "2024-10-25T12:38:46.676Z",
            "updateAt": "2024-10-25T12:38:46.676Z",
            "vsersion": 1,
            "id": 3,
            "title": "반지의 제왕2",
            "genre": "AC"
        },
        {
            "createdAt": "2024-10-25T12:38:48.786Z",
            "updateAt": "2024-10-25T12:38:48.786Z",
            "vsersion": 1,
            "id": 4,
            "title": "반지의 제왕3",
            "genre": "AC"
        }
    ],
    3
]

*/

// 위 코드 또는 아래 코드 형식으로 한다. 다만 모양이 이쁜것은 위 방식이다
/*
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  genre: string;

  @Column(() => BaseEntity)
  base: BaseEntity;
}

결과 모습

[
    [
        {
            "id": 2,
            "title": "반지의 제왕1",
            "genre": "AC",
            "base": {
                "createdAt": "2024-10-25T12:38:44.392Z",
                "updateAt": "2024-10-25T12:38:44.392Z",
                "version": 1
            }
        },
        {
            "id": 3,
            "title": "반지의 제왕2",
            "genre": "AC",
            "base": {
                "createdAt": "2024-10-25T12:38:46.676Z",
                "updateAt": "2024-10-25T12:38:46.676Z",
                "version": 1
            }
        },
        {
            "id": 4,
            "title": "반지의 제왕3",
            "genre": "AC",
            "base": {
                "createdAt": "2024-10-25T12:38:48.786Z",
                "updateAt": "2024-10-25T12:38:48.786Z",
                "version": 1
            }
        }
    ],
    3
]
    
*/
