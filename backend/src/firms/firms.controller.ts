import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { FirmsService } from './firms.service';
import { MarketType } from '@prisma/client';

@Controller('api/firms')
export class FirmsController {
  constructor(private readonly firmsService: FirmsService) {}

  @Get()
  findAll(
    @Query('marketType') marketType?: MarketType,
    @Query('search') search?: string,
    @Query('platform') platform?: string,
  ) {
    return this.firmsService.findAll({ marketType, search, platform });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.firmsService.findOne(id);
  }
}