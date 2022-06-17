import { RegistrationRepository } from '../core/repositories';
import { Registration } from '../core/models';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PricePackageModule } from 'src/price-package/price-package.module';
import { SubjectModule } from 'src/subject/subject.module';
import { UserModule } from 'src/user/user.module';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { Connection } from 'typeorm';

@Module({
    imports: [AuthModule, UserModule, PricePackageModule, SubjectModule, TypeOrmModule.forFeature([Registration])],
    controllers: [RegistrationController],
    providers: [RegistrationService, { provide: RegistrationRepository, useFactory: (connection: Connection) => connection.getCustomRepository(RegistrationRepository), inject: [Connection] }],
    exports: [],
})
export class RegistrationModule {}
