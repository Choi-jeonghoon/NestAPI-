import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entity/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  getManyMovies(title?: string) {
    /// 추후 필터 기능 추가
    return this.movieRepository.find();
    // if (!title) {
    //   return this.movies;
    // }
    // return this.movies.filter((m) => m.title.startsWith(title));
  }

  async getMovieById(id: number) {
    const movie = await this.movieRepository.findOne({
      where: {
        id,
      },
    });
    if (!movie) {
      //throw new Error('존재하지 않는 ID');
      throw new NotFoundException('존재하지 않는 영화입니다.');
    }
    return movie;
  }
  async createMovie(createMovieDto: CreateMovieDto) {
    const movie = await this.movieRepository.save(createMovieDto);

    return movie;
  }

  async updateMovie(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.movieRepository.findOne({
      where: {
        id,
      },
    });

    if (!movie) {
      //throw new Error('존재하지 않는 ID');
      throw new NotFoundException('존재하지 않는 영화입니다.');
    }

    this.movieRepository.update({ id }, updateMovieDto);
    const newMovie = await this.movieRepository.findOne({
      where: {
        id,
      },
    });
    return newMovie;
  }

  async delteMovie(id: number) {
    const movie = await this.movieRepository.findOne({
      where: {
        id,
      },
    });

    if (!movie) {
      //throw new Error('존재하지 않는 ID');
      throw new NotFoundException('존재하지 않는 영화입니다.');
    }
    await this.movieRepository.delete(id);

    return id;
  }
}
