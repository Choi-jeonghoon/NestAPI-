import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

export class BaseEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @VersionColumn()
  vsersion: number;
}

@Entity()
//아래는 코드는 상속 받아 처리는 것이다
export class Movie extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  genre: string;
}
/*
결과 반환되는 모습

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
