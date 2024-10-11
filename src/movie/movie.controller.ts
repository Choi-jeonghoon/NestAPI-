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
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

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
  postMovie(@Body() body: CreateMovieDto) {
    return this.movieService.createMovie(body);
  }

  @Patch(':id')
  patchMovie(@Param('id') id: string, @Body() body: UpdateMovieDto) {
    return this.movieService.updateMovie(+id, body);
  }

  @Delete(':id')
  deleteMovie(@Param('id') id: string) {
    return this.movieService.delteMovie(+id);
  }
}
