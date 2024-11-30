import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable() //의존성 주입
export class MovieTitleValidationPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!value) {
      return value;
    }
    if (value.length <= 2) {
      throw new BadRequestException('영화 제목을 3글자 이상 작성해주세요');
    }

    return value;
  }
}
