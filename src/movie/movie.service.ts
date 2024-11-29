import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entity/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { MovieDetail } from './entity/movie-detail.entity';
import { Director } from 'src/director/entity/director.entity';
import { Genre } from 'src/genre/entity/genre.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,

    @InjectRepository(MovieDetail)
    private readonly movieDeatailRepository: Repository<MovieDetail>,

    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>,

    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(title?: string) {
    const qb = await this.movieRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.director', 'director')
      .leftJoinAndSelect('movie.genres', 'genres');

    if (title) {
      qb.where('movie.title LIKE :title', { title: `%${title}%` });
    }

    return await qb.getManyAndCount();

    // if (!title) {
    //   const [movies, count] = await Promise.all([
    //     this.movieRepository.find({ relations: ['director', 'genres'] }), // 전체 영화 데이터
    //     this.movieRepository.count(), // 전체 영화 개수
    //   ]);
    //   return { movies, count };
    // }
    // const [movies, count] = await this.movieRepository.findAndCount({
    //   where: {
    //     title: Like(`%${title}%`),
    //   },
    //   relations: ['director', 'genres'],
    // });
    // return { movies, count };
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
    //쿼리 빌더로 하는경우
    const movie = await this.movieRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.director', 'director')
      .leftJoinAndSelect('movie.genres', 'genres')
      .leftJoinAndSelect('movie.detail', 'detail')
      .where('movie.id= :id', { id })
      .getOne();

    // const movie = await this.movieRepository.findOne({
    //   where: {
    //     id,
    //   },
    //   relations: ['detail', 'director', 'genres'],
    // });
    if (!movie) {
      //throw new Error('존재하지 않는 ID');
      throw new NotFoundException('존재하지 않는 영화입니다.');
    }
    return movie;
  }

  async create(createMovieDto: CreateMovieDto) {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    try {
      const director = await qr.manager.findOne(Director, {
        where: {
          id: createMovieDto.directorId,
        },
      });

      if (!director) {
        throw new NotFoundException('존재하지 않는 ID의 감독입니다.');
      }

      const genres = await qr.manager.find(Genre, {
        where: {
          id: In(createMovieDto.genreIds), //In은 배열 형태의 조건을 효율적으로 처리 list 넣은 값들을 다 찾기위해
        },
      });

      if (genres.length !== createMovieDto.genreIds.length) {
        throw new NotFoundException(
          '존재하지 않는 장르가 있습니다 존재하는 ids-> ${genres.map(genre=>genre.id).join(',
          ')}',
        );
      }
      //쿼리 빌더로 하는경우
      //save 하는 작업을 쿼리빌더로 작업해야될경우에는 아래와같이   detail: { id: movieDetailId }, 직접 연결을 시켜줘야되는 단점이 있다.
      //동시에 같이 생성하는 것이 안된다.
      const movieDetail = await qr.manager
        .createQueryBuilder()
        .insert()
        .into(MovieDetail)
        .values({
          detail: createMovieDto.detail,
        })
        .execute();

      // 트랜젝션 적용 하고 나서 검증하기위한 에러 던져서 확인
      //throw new NotFoundException('에러');

      const movieDetailId = movieDetail.identifiers[0].id;

      const movie = await qr.manager
        .createQueryBuilder()
        .insert()
        .into(Movie)
        .values({
          title: createMovieDto.title,
          detail: { id: movieDetailId },
          director,
          //genres (ManyToMany) 안되기때문에 아래와같이 다시 장르를 직접 생성해줘야된다.
        })
        .execute();

      const movieId = movie.identifiers[0].id;
      await qr.manager
        .createQueryBuilder()
        .relation(Movie, 'genres')
        .of(movieId)
        .add(genres.map((genre) => genre.id));

      // const movie = await this.movieRepository.save({
      //   title: createMovieDto.title,
      //   detail: { detail: createMovieDto.detail },
      //   director,
      //   genres,
      // });

      // return movie;

      await qr.commitTransaction();

      return this.movieRepository.find({
        where: {
          id: movieId,
        },
        relations: ['detail', 'director', 'genres'],
      });
    } catch (e) {
      await qr.rollbackTransaction();
      throw e;
    } finally {
      await qr.release();
    }
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['detail', 'genres'],
    });

    if (!movie) {
      throw new NotFoundException('존재하지 않는 영화입니다.');
    }

    let newDirector;

    const { detail, directorId, genreIds, ...movieRest } = updateMovieDto;

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

    let newGenres;

    if (genreIds) {
      const genres = await this.genreRepository.find({
        where: { id: In(genreIds) },
      });
      if (genres.length !== updateMovieDto.genreIds.length) {
        throw new NotFoundException(
          '존재하지 않는 장르가 있습니다 존재하는 ids-> ${genres.map(genre=>genre.id).join(',
          ')}',
        );
      }
      newGenres = genres;
    }

    const movieUpdateFields = {
      ...movieRest,
      ...(newDirector && { director: newDirector }),
    };

    //영화 데이터 업데이트
    //await this.movieRepository.update({ id }, movieUpdateFields);

    //쿼리 빌더로 하는경우
    await this.movieRepository
      .createQueryBuilder()
      .update(movie)
      .set(movieUpdateFields)
      .where('id = :id', { id })
      .execute();

    /* 
      if (detail && movie.detail) {
       await this.movieDeatailRepository.update(
         { id: movie.detail.id },
         { detail },
       );
    */

    /*
    @Memo  detail의 값이 처음 null 일때 문제가 발생한다. 아래와같이 로직 을 추가해줘 해결한다.
    */
    if (detail) {
      if (movie.detail) {
        //쿼리 빌더로 하는경우
        await this.movieDeatailRepository
          .createQueryBuilder()
          .update(MovieDetail)
          .set({ detail })
          .where('id = :id', { id: movie.detail.id })
          .execute();

        // 기존의 detail 값이 존재하면 update 실행
        // await this.movieDeatailRepository.update(
        //   { id: movie.detail.id },
        //   { detail },
        // );
      } else {
        // detail이 null일 경우 새로 생성 및 저장
        const newDetail = this.movieDeatailRepository.create({ detail, movie });
        await this.movieDeatailRepository.save(newDetail);
        movie.detail = newDetail; // 관계 반영
        await this.movieRepository.save(movie);
      }
    }

    //쿼리 빌더로 하는경우( 장르 추가 )
    if (newGenres) {
      await this.movieRepository
        .createQueryBuilder()
        .relation(Movie, 'genres')
        .of(id)
        .addAndRemove(
          newGenres.map((genre) => genre.id),
          movie.genres.map((genre) => genre.id),
        );
    }

    // 변경된 Movie 반환
    // const newMovie = await this.movieRepository.findOne({
    //   where: { id },
    //   relations: ['detail', 'director'],
    // });

    // newMovie.genres = newGenres;

    // await this.movieRepository.save(newMovie);

    // return this.movieRepository.preload(newMovie);

    return this.movieRepository.findOne({
      where: { id },
      relations: ['detail', 'director', 'genres'],
    });
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

    //쿼리 빌더로 하는경우( 영화 삭제 )
    await this.movieRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();

    //await this.movieRepository.delete(id);

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
