import { Test, TestingModule } from '@nestjs/testing';
import { PricePackageController } from '../price-package.controller';

describe('PricePackageController', () => {
    let controller: PricePackageController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PricePackageController],
        }).compile();

        controller = module.get<PricePackageController>(PricePackageController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
