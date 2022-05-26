import { Controller } from '@nestjs/common';
import { PricePackageService } from './price-package.service';

@Controller('price-package')
export class PricePackageController {
    constructor(private readonly pricePackageService: PricePackageService) {}
}
