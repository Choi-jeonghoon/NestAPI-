import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entity/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { MovieDetail } from './entity/movie-detail.entity';
import { Director } from 'src/director/entity/director.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,

    @InjectRepository(MovieDetail)
    private readonly movieDeatailRepository: Repository<MovieDetail>,

    @InjectRepository(Director)
    private readonly directorRepository: Repository<MovieDetail>,
  ) {}

  async findAll(title?: string) {
    if (!title) {
      const [movies, count] = await Promise.all([
        this.movieRepository.find({ relations: ['director'] }), // 전체 영화 데이터
        this.movieRepository.count(), // 전체 영화 개수
      ]);
      return { movies, count };
    }
    const [movies, count] = await this.movieRepository.findAndCount({
      where: {
        title: Like(`%${title}%`),
      },
      relations: ['director'],
    });
    return { movies, count };
  }

  // async getManyMovies(title?: string) {
  //   /// 추후 필터 기능 추가
  //   if (!title) {
  //     return this.movieRepository.find(), await this.movieRepository.count();
  //   }
  //   return this.movieRepository.findAndCount({
  //     where: {
  //       title: Like(`%${title}%`),
  //     },
  //   });
  // }

  async findOne(id: number) {
    const movie = await this.movieRepository.findOne({
      where: {
        id,
      },
      relations: ['detail', 'director'],
    });
    if (!movie) {
      //throw new Error('존재하지 않는 ID');
      throw new NotFoundException('존재하지 않는 영화입니다.');
    }
    return movie;
  }

  async create(createMovieDto: CreateMovieDto) {
    const director = await this.directorRepository.findOne({
      where: {
        id: createMovieDto.directorId,
      },
    });

    if (!director) {
      throw new NotFoundException('존재하지 않는 ID의 감독입니다.');
    }

    const movie = await this.movieRepository.save({
      title: createMovieDto.title,
      genre: createMovieDto.genre,
      detail: { detail: createMovieDto.detail },
      director,
    });

    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['detail', 'director'],
    });
    console.log(movie);

    if (!movie) {
      throw new NotFoundException('존재하지 않는 영화입니다.');
    }

    let newDirector;

    const { detail, directorId, ...movieRest } = updateMovieDto;

    //값을 입력했을때
    if (directorId) {
      const director = await this.directorRepository.findOne({
        where: {
          id: directorId, // 올바른 조건으로 수정
        },
      });

      //값이 잘못되었을때
      if (!director) {
        throw new NotFoundException('존재하지 않는 감독의 id 입니다.!');
      }

      newDirector = director;
    }

    const movieUpdateFields = {
      ...movieRest,
      ...(newDirector && { director: newDirector }),
    };

    //영화 데이터 업데이트
    await this.movieRepository.update({ id }, movieUpdateFields);

    // if (detail && movie.detail) {
    //   await this.movieDeatailRepository.update(
    //     { id: movie.detail.id },
    //     { detail },
    //   );
    // }

    /*
    @Memo  detail의 값이 처음 null 일때 문제가 발생한다. 아래와같이 로직 을 추가해줘 해결한다.
    */
    if (detail) {
      if (movie.detail) {
        // 기존의 detail 값이 존재하면 update 실행
        await this.movieDeatailRepository.update(
          { id: movie.detail.id },
          { detail },
        );
      } else {
        // detail이 null일 경우 새로 생성 및 저장
        const newDetail = this.movieDeatailRepository.create({ detail, movie });
        await this.movieDeatailRepository.save(newDetail);
        movie.detail = newDetail; // 관계 반영
        await this.movieRepository.save(movie);
      }
    }

    // 변경된 Movie 반환
    const newMovie = await this.movieRepository.findOne({
      where: { id },
      relations: ['detail', 'director'],
    });
    console.log(newMovie);
    return newMovie;
  }

  async remove(id: number) {
    const movie = await this.movieRepository.findOne({
      where: {
        id,
      },
      relations: ['detail'],
    });

    if (!movie) {
      //throw new Error('존재하지 않는 ID');
      // success: false,
      // message: `ID ${id}번 영화는 존재하지 않습니다.`,
      throw new NotFoundException('존재하지 않는 영화입니다.');
    }
    await this.movieRepository.delete(id);
    // 상세 정보가 있을 경우만 삭제( 기존에 생성할때 디테일 정보를 생성안하고 한경우를 방지 )
    if (movie.detail) {
      await this.movieDeatailRepository.delete(movie.detail.id);
    }

    // 성공 응답 반환
    return {
      success: true,
      message: `ID ${id}번 영화가 삭제되었습니다.`,
      deletedId: id,
    };
  }
}
