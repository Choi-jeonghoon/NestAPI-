import { Module } from '@nestjs/common';
import { MovieModule } from './movie/movie.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'postgres', // 데이터베이스 타입 (PostgreSQL 예시)
      host: process.env.DB_HOST as 'postgres', // 호스트명
      port: parseInt(process.env.DB_PORT), // 포트 번호
      username: process.env.DB_USERNAME as 'postgres', // 데이터베이스 유저 아이디
      password: process.env.DB_PASSWORD as 'postgres', // 데이터베이스 비밀번호
      database: process.env.DB_DATABASE as 'postgres', // 사용할 데이터베이스 이름
      entities: [], // 사용할 엔티티들
      synchronize: true, //개발에서만 true를 해야된다.
    }),
    MovieModule,
  ],
})
export class AppModule {}
