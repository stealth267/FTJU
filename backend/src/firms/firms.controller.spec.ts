import { Test, TestingModule } from '@nestjs/testing';
import { FirmsController } from './firms.controller';

describe('FirmsController', () => {
  let controller: FirmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirmsController],
    }).compile();

    controller = module.get<FirmsController>(FirmsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
