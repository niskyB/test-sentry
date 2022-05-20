import { AuthModule } from './../auth/auth.module';
import { UserModule } from './../user/user.module';
import { MarketingModule } from './../marketing/marketing.module';
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
    imports: [MarketingModule, UserModule, AuthModule],
    providers: [AdminService],
    controllers: [AdminController],
})
export class AdminModule {}
