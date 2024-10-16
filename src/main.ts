import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //DTO에서 정의되지 않은 필드를 자동으로 제거하는 역할
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 필드가 있으면 요청을 거부하고 에러 발생
    }),
  );
  await app.listen(3000);
}
bootstrap();
