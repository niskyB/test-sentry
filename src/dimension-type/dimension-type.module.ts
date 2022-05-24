import { Module } from '@nestjs/common';
import { DimensionTypeService } from './dimension-type.service';
import { DimensionTypeController } from './dimension-type.controller';

@Module({
    providers: [DimensionTypeService],
    controllers: [DimensionTypeController],
})
export class DimensionTypeModule {}
