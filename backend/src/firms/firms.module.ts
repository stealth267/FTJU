import { Module } from '@nestjs/common';
import { FirmsService } from './firms.service';
import { FirmsController } from './firms.controller';
import { PrismaModule } from '../prisma/prisma.module'; // 👈 Importa PrismaModule

@Module({
  imports: [PrismaModule], // 👈 Añade PrismaModule aquí
  controllers: [FirmsController],
  providers: [FirmsService],
})
export class FirmsModule {}