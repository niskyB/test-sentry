import { DimensionTypeRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DimensionTypeService } from './dimension-type.service';
import { DimensionTypeController } from './dimension-type.controller';
import { DimensionTypesController } from './dimension-types.controller';

@Module({
    imports: [TypeOrmModule.forFeature([DimensionTypeRepository])],
    providers: [DimensionTypeService],
    controllers: [DimensionTypeController, DimensionTypesController],
    exports: [DimensionTypeService],
})
export class DimensionTypeModule {}
