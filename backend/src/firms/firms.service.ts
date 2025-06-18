import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MarketType } from '@prisma/client';

@Injectable()
export class FirmsService {
  constructor(private prisma: PrismaService) {}

  async findAll(queryParams: { marketType?: MarketType; search?: string; platform?: string }) {
    const { marketType, search, platform } = queryParams;
    const where: any = {};

    if (marketType) {
      where.marketType = marketType;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (platform) {
      where.platforms = {
        some: {
          name: {
            equals: platform,
            mode: 'insensitive',
          },
        },
      };
    }

    return this.prisma.firm.findMany({
      where,
      include: {
        platforms: true,
        // --- ESTA ES LA LÍNEA QUE FALTABA ---
        evaluationPrograms: true, // Le decimos a Prisma que incluya los programas
      },
      orderBy: {
        rating: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const firm = await this.prisma.firm.findUnique({
      where: { id },
      include: {
        evaluationPrograms: true,
        platforms: true,
      },
    });

    if (!firm) {
      throw new NotFoundException(`Firm with ID ${id} not found`);
    }

    return firm;
  }
}
