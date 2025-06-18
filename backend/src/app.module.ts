import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module'; // <-- IMPORTAR
import { FirmsModule } from './firms/firms.module';   // <-- IMPORTAR

@Module({
  imports: [PrismaModule, FirmsModule], // <-- AÑADIRLOS AQUÍ
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}