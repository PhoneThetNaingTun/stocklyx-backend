import { Test, TestingModule } from '@nestjs/testing';
import { MeasurementUnitService } from './measurement-unit.service';

describe('MeasurementUnitService', () => {
  let service: MeasurementUnitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeasurementUnitService],
    }).compile();

    service = module.get<MeasurementUnitService>(MeasurementUnitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
