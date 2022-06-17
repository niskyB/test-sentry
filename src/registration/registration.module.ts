import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PricePackageModule } from 'src/price-package/price-package.module';
import { SubjectModule } from 'src/subject/subject.module';
import { UserModule } from 'src/user/user.module';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';

@Module({
    imports: [AuthModule, UserModule, PricePackageModule, SubjectModule],
    controllers: [RegistrationController],
    providers: [RegistrationService],
    exports: [],
})
export class RegistrationModule {}
