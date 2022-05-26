import { PricePackageRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PricePackageService } from './price-package.service';
import { PricePackageController } from './price-package.controller';

@Module({
    imports: [TypeOrmModule.forFeature([PricePackageRepository])],
    providers: [PricePackageService],
    controllers: [PricePackageController],
    exports: [PricePackageService],
})
export class PricePackageModule {}
