import { Module } from '@nestjs/common';
import { PricePackageService } from './price-package.service';
import { PricePackageController } from './price-package.controller';

@Module({
    providers: [PricePackageService],
    controllers: [PricePackageController],
})
export class PricePackageModule {}
