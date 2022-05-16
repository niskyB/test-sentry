import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SliderController } from './slider.controller';
import { SliderService } from './slider.service';
import { SliderRepository } from '../core/repositories';

@Module({
    imports: [TypeOrmModule.forFeature([SliderRepository])],
    controllers: [SliderController],
    providers: [SliderService],
    exports: [TypeOrmModule],
})
export class SliderModule {}
