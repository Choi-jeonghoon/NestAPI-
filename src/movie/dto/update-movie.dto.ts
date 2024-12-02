import { PartialType } from '@nestjs/mapped-types';
// import {
//   ArrayNotEmpty,
//   IsArray,
//   IsNotEmpty,
//   IsNumber,
//   IsOptional,
//   IsString,
// } from 'class-validator';
import { CreateMovieDto } from './create-movie.dto';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {}

// export class UpdateMovieDto {
//   @IsNotEmpty() // 값이 비어 있으면 안 됨 (빈 문자열 또는 null 허용 안 됨)
//   @IsString()
//   @IsOptional() // 해당 필드는 선택 사항임 (즉, 필수 입력이 아님)
//   title?: string;

//   @IsArray()
//   @ArrayNotEmpty()
//   @IsNumber(
//     {},
//     {
//       each: true,
//     },
//   )
//   @IsOptional()
//   genreIds?: number[];

//   @IsNotEmpty()
//   @IsString()
//   @IsOptional()
//   detail?: string;

//   @IsNotEmpty()
//   @IsNumber()
//   @IsOptional()
//   directorId?: number;
// }
