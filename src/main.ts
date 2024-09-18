import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from '@modules/app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
    .build();

  ;

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/', app, document, {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.5/swagger-ui.min.css',   //? se coloca '/' para que swagger sea la web principal ! 
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
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
