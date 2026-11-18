import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les propriétés qui ne figurent pas dans la DTO
      forbidNonWhitelisted: true, // Refuse une requête si champs en trop
      transform: true, // Peut transformer des données entrantes selon le type déclaré dans la DTO
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((error) => {
  console.error('‼️ Erreur lors du démarrage', error);
});
