import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MovieService } from './movie.service';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  getMoives(@Query('title') title?: string) {
    // 타입을 검증할때는 여기 컨트롤러파일에서 진행한다.
    return this.movieService.getManyMovies(title);
  }

  @Get(':id')
  getMoive(@Param('id') id: string) {
    return this.movieService.getMovieById(+id);
  }

  @Post('')
  postMovie(@Body('title') title: string) {
    return this.movieService.createMovie(title);
  }

  @Patch(':id')
  patchMovie(@Param('id') id: string, @Body('title') title: string) {
    return this.movieService.updateMovie(+id, title);
  }

  @Delete(':id')
  deleteMovie(@Param('id') id: string) {
    return this.movieService.delteMovie(+id);
  }
}
