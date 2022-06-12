import { Sale } from './../core/models';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';
import { SaleRepository } from '../core/repositories';
import { Connection } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Sale])],
    controllers: [SaleController],
    providers: [SaleService, { provide: SaleRepository, useFactory: (connection: Connection) => connection.getCustomRepository(SaleRepository), inject: [Connection] }],
    exports: [SaleService],
})
export class SaleModule {}
