import { SliderModule } from './../slider/slider.module';
import { UserModule } from './../user/user.module';
import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { MarketingService } from './marketing.service';
import { MarketingController } from './marketing.controller';

@Module({
    imports: [AuthModule, UserModule, SliderModule],
    providers: [MarketingService],
    controllers: [MarketingController],
})
export class MarketingModule {}
