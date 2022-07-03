import { FilterModule, DataModule, DateModule } from '../core/providers';
import { SaleModule } from './../sale/sale.module';
import { CustomerModule } from './../customer/customer.module';
import { RegistrationRepository } from '../core/repositories';
import { Registration } from '../core/models';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PricePackageModule } from '../price-package/price-package.module';
import { UserModule } from '../user/user.module';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { Connection } from 'typeorm';
import { RegistrationsController } from './registrations.controller';

@Module({
    imports: [
        AuthModule,
        forwardRef(() => UserModule),
        forwardRef(() => PricePackageModule),
        TypeOrmModule.forFeature([Registration]),
        CustomerModule,
        DataModule,
        SaleModule,
        FilterModule,
        DateModule,
        DateModule,
    ],
    controllers: [RegistrationController, RegistrationsController],
    providers: [RegistrationService, { provide: RegistrationRepository, useFactory: (connection: Connection) => connection.getCustomRepository(RegistrationRepository), inject: [Connection] }],
    exports: [RegistrationService],
})
export class RegistrationModule {}
