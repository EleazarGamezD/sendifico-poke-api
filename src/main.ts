import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from '@modules/app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Swagger } from '@core/enum/swagger';

async function bootstrap(): Promise<void> {

  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('PokeDex - Sendifico')
    .setDescription('Documentación para Prueba de Backend')
    .setVersion('1.0')
    .addTag('PokeDex')
    .setContact(
      "Eleazar Gámez",
      "https://eleazargamezd.github.io/portfolio/",
      "eleazar.gamezd@gmail.com"
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/', app, document, {
    customCssUrl: Swagger.CUSTOM_CSS_CDN,
    customJs: [
      Swagger.CUSTOM_JS_CDN_BUNDLE,
      Swagger.CUSTOM_JS_CDN_PRESET,
    ],

    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.enableCors();


  await app.listen(process.env.PORT);
  logger.log(`App Running on port ${process.env.PORT}`);
}

bootstrap();
