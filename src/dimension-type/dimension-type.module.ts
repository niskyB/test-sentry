import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { DimensionType } from './../core/models';
import { DimensionTypeRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DimensionTypeService } from './dimension-type.service';
import { DimensionTypeController } from './dimension-type.controller';
import { DimensionTypesController } from './dimension-types.controller';
import { Connection } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([DimensionType]), AuthModule, UserModule],
    providers: [DimensionTypeService, { provide: DimensionTypeRepository, useFactory: (connection: Connection) => connection.getCustomRepository(DimensionTypeRepository), inject: [Connection] }],
    controllers: [DimensionTypeController, DimensionTypesController],
    exports: [DimensionTypeService],
})
export class DimensionTypeModule {}
