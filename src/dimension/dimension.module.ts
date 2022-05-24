import { DimensionTypeModule } from './../dimension-type/dimension-type.module';
import { UserModule } from './../user/user.module';
import { AuthModule } from './../auth/auth.module';
import { DimensionRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DimensionService } from './dimension.service';
import { DimensionController } from './dimension.controller';

@Module({
    imports: [TypeOrmModule.forFeature([DimensionRepository]), AuthModule, UserModule, DimensionTypeModule],
    providers: [DimensionService],
    controllers: [DimensionController],
})
export class DimensionModule {}
