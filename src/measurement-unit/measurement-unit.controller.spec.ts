import { Test, TestingModule } from '@nestjs/testing';
import { MeasurementUnitController } from './measurement-unit.controller';

describe('MeasurementUnitController', () => {
  let controller: MeasurementUnitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeasurementUnitController],
    }).compile();

    controller = module.get<MeasurementUnitController>(MeasurementUnitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
