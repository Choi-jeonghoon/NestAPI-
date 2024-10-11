import { Injectable, NotFoundException } from '@nestjs/common';
import { title } from 'process';

export interface Movie {
  id: number;
  title: string;
}

@Injectable()
export class MovieService {
  private movies: Movie[] = [
    {
      id: 1,
      title: '해리포터',
    },
    {
      id: 2,
      title: '반지의제왕',
    },
  ];
  private idCounter = 3;

  getManyMovies(title?: string) {
    if (!title) {
      return this.movies;
    }
    return this.movies.filter((m) => m.title.startsWith(title));
  }

  getMovieById(id: number) {
    const movie = this.movies.find((m) => m.id === +id);
    if (!movie) {
      //throw new Error('존재하지 않는 ID');
      throw new NotFoundException('존재하지 않는 영화입니다.');
    }
    return movie;
  }
  createMovie(title: string) {
    const movie: Movie = {
      id: this.idCounter++,
      title: title,
    };

    this.movies.push(movie);
    return movie;
  }

  updateMovie(id: number, title: string) {
    const movie = this.movies.find((m) => m.id === +id);

    if (!movie) {
      //throw new Error('존재하지 않는 ID');
      throw new NotFoundException('존재하지 않는 영화입니다.');
    }
    Object.assign(movie, { title });
    return movie;
  }

  delteMovie(id: number) {
    const movieIndex = this.movies.findIndex((m) => m.id === +id);

    if (movieIndex === -1) {
      //throw new Error('존재하지 않는 ID');
      throw new NotFoundException('존재하지 않는 영화입니다.');
    }

    this.movies.splice(movieIndex, 1);

    return id;
  }
}
