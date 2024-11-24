import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateMovieDto {
  @IsNotEmpty() // 값이 비어 있으면 안 됨 (빈 문자열 또는 null 허용 안 됨)
  @IsString()
  @IsOptional() // 해당 필드는 선택 사항임 (즉, 필수 입력이 아님)
  title?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  genre?: string;

  @IsNotEmpty()
  @IsOptional()
  detail?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  directorId?: number;
}
