import { Slider } from './../core/models';
import { MarketingModule } from './../marketing/marketing.module';
import { S3Module } from './../core/providers/s3/s3.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from './../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { SliderController } from './slider.controller';
import { SliderService } from './slider.service';
import { SliderRepository } from '../core/repositories';
import { SlidersController } from './sliders.controller';
import { Connection } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Slider]), forwardRef(() => AuthModule), forwardRef(() => UserModule), S3Module, forwardRef(() => MarketingModule)],
    controllers: [SliderController, SlidersController],
    providers: [SliderService, { provide: SliderRepository, useFactory: (connection: Connection) => connection.getCustomRepository(SliderRepository), inject: [Connection] }],
    exports: [TypeOrmModule, SliderService],
})
export class SliderModule {}
