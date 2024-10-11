import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('movie')
  getMoives(@Query('title') title?: string) {
    // 타입을 검증할때는 여기 컨트롤러파일에서 진행한다.
    return this.appService.getManyMovies(title);
  }

  @Get('movie/:id')
  getMoive(@Param('id') id: string) {
    return this.appService.getMovieById(+id);
  }

  @Post('movie')
  postMovie(@Body('title') title: string) {
    return this.appService.createMovie(title);
  }

  @Patch('movie/:id')
  patchMovie(@Param('id') id: string, @Body('title') title: string) {
    return this.appService.updateMovie(+id, title);
  }

  @Delete('movie/:id')
  deleteMovie(@Param('id') id: string) {
    return this.appService.delteMovie(+id);
  }
}
