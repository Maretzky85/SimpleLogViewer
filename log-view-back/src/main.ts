import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Logs Aggregator')
    .setDescription('Logs Aggregator API')
    .setVersion('1.0')
    .addTag('Logs')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : [];
  app.enableCors({
    origin: allowedOrigins,
  });
  await app.listen(PORT);
}
bootstrap().then(() => console.debug(`App started, listening on port ${PORT}`));
