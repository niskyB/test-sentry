import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';
import { SaleRepository } from '../core/repositories';

@Module({
    imports: [TypeOrmModule.forFeature([SaleRepository])],
    controllers: [SaleController],
    providers: [SaleService],
    exports: [SaleService],
})
export class SaleModule {}
