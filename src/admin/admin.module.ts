import { CustomerModule } from './../customer/customer.module';
import { AdminRepository } from './../core/repositories';
import { Admin } from './../core/models';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataModule } from './../core/providers';
import { ExpertModule } from './../expert/expert.module';
import { SaleModule } from './../sale/sale.module';
import { AuthModule } from './../auth/auth.module';
import { UserModule } from './../user/user.module';
import { MarketingModule } from './../marketing/marketing.module';
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Connection } from 'typeorm';

@Module({
    imports: [MarketingModule, UserModule, AuthModule, SaleModule, ExpertModule, DataModule, TypeOrmModule.forFeature([Admin]), CustomerModule, ExpertModule],
    providers: [AdminService, { provide: AdminRepository, useFactory: (connection: Connection) => connection.getCustomRepository(AdminRepository), inject: [Connection] }],
    controllers: [AdminController],
})
export class AdminModule {}
