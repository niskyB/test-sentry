import { Test, TestingModule } from '@nestjs/testing';
import { DimensionTypeController } from '../dimension-type.controller';

describe('DimensionTypeController', () => {
    let controller: DimensionTypeController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DimensionTypeController],
        }).compile();

        controller = module.get<DimensionTypeController>(DimensionTypeController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
