import { MarketingRepository } from './../core/repositories/marketing.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SliderModule } from './../slider/slider.module';
import { UserModule } from './../user/user.module';
import { AuthModule } from './../auth/auth.module';
import { Module, forwardRef } from '@nestjs/common';
import { MarketingService } from './marketing.service';
import { MarketingController } from './marketing.controller';

@Module({
    imports: [AuthModule, UserModule, forwardRef(() => SliderModule), TypeOrmModule.forFeature([MarketingRepository])],
    providers: [MarketingService],
    controllers: [MarketingController],
    exports: [MarketingService],
})
export class MarketingModule {}
