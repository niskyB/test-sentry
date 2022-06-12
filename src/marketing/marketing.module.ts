import { Marketing } from './../core/models';
import { MarketingRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SliderModule } from './../slider/slider.module';
import { UserModule } from './../user/user.module';
import { AuthModule } from './../auth/auth.module';
import { Module, forwardRef } from '@nestjs/common';
import { MarketingService } from './marketing.service';
import { MarketingController } from './marketing.controller';
import { Connection } from 'typeorm';

@Module({
    imports: [AuthModule, UserModule, forwardRef(() => SliderModule), TypeOrmModule.forFeature([Marketing])],
    providers: [MarketingService, { provide: MarketingRepository, useFactory: (connection: Connection) => connection.getCustomRepository(MarketingRepository), inject: [Connection] }],
    controllers: [MarketingController],
    exports: [MarketingService],
})
export class MarketingModule {}
