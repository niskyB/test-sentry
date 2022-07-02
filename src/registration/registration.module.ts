import { FilterModule } from '../core/providers/filter/filter.module';
import { SaleModule } from './../sale/sale.module';
import { DataModule } from './../core/providers/fake-data/data.module';
import { CustomerModule } from './../customer/customer.module';
import { RegistrationRepository } from '../core/repositories';
import { Registration } from '../core/models';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PricePackageModule } from 'src/price-package/price-package.module';
import { UserModule } from 'src/user/user.module';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { Connection } from 'typeorm';
import { RegistrationsController } from './registrations.controller';
import { DateModule } from '../core/providers/date/date.module';

@Module({
    imports: [AuthModule, UserModule, PricePackageModule, TypeOrmModule.forFeature([Registration]), CustomerModule, DataModule, SaleModule, FilterModule, DateModule, DateModule],
    controllers: [RegistrationController, RegistrationsController],
    providers: [RegistrationService, { provide: RegistrationRepository, useFactory: (connection: Connection) => connection.getCustomRepository(RegistrationRepository), inject: [Connection] }],
    exports: [],
})
export class RegistrationModule {}
