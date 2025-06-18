import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- AÑADE ESTA LÍNEA AQUÍ ---
  app.enableCors();
  // ---------------------------------

  await app.listen(3001); // Asegúrate que el puerto sea 3001
}
bootstrap();