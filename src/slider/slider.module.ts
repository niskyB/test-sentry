import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SliderController } from './slider.controller';
import { SliderService } from './slider.service';
import { SliderRepository } from '../core/repositories';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([SliderRepository]), AuthModule, UserModule],
    controllers: [SliderController],
    providers: [SliderService],
    exports: [TypeOrmModule],
})
export class SliderModule {}
