import { INestApplication, ValidationPipe } from '@nestjs/common';

export function configureApp(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les propriétés qui ne figurent pas dans la DTO
      forbidNonWhitelisted: true, // Refuse une requête si champs en trop
      transform: true, // Peut transformer des données entrantes selon le type déclaré dans la DTO
    }),
  );
}
