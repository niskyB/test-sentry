import { Marketing } from './../core/models';
import { MarketingRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { MarketingService } from './marketing.service';
import { MarketingController } from './marketing.controller';
import { Connection } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Marketing])],
    providers: [MarketingService, { provide: MarketingRepository, useFactory: (connection: Connection) => connection.getCustomRepository(MarketingRepository), inject: [Connection] }],
    controllers: [MarketingController],
    exports: [MarketingService],
})
export class MarketingModule {}
