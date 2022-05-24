import { Test, TestingModule } from '@nestjs/testing';
import { DimensionTypeService } from '../dimension-type.service';

describe('DimensionTypeService', () => {
    let service: DimensionTypeService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DimensionTypeService],
        }).compile();

        service = module.get<DimensionTypeService>(DimensionTypeService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
