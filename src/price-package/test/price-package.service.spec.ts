import { Test, TestingModule } from '@nestjs/testing';
import { PricePackageService } from '../price-package.service';

describe('PricePackageService', () => {
    let service: PricePackageService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PricePackageService],
        }).compile();

        service = module.get<PricePackageService>(PricePackageService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
