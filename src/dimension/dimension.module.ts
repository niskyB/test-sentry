import { SubjectModule } from './../subject/subject.module';
import { DimensionTypeModule } from './../dimension-type/dimension-type.module';
import { UserModule } from './../user/user.module';
import { AuthModule } from './../auth/auth.module';
import { DimensionRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DimensionService } from './dimension.service';
import { DimensionController } from './dimension.controller';
import { DimensionsController } from './dimensions.controller';

@Module({
    imports: [TypeOrmModule.forFeature([DimensionRepository]), AuthModule, UserModule, DimensionTypeModule, SubjectModule],
    providers: [DimensionService],
    controllers: [DimensionController, DimensionsController],
    exports: [DimensionService],
})
export class DimensionModule {}
