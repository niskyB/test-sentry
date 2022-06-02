import { SubjectModule } from './../subject/subject.module';
import { UserModule } from './../user/user.module';
import { AuthModule } from './../auth/auth.module';
import { PricePackageRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PricePackageService } from './price-package.service';
import { PricePackageController } from './price-package.controller';

@Module({
    imports: [TypeOrmModule.forFeature([PricePackageRepository]), AuthModule, UserModule, SubjectModule],
    providers: [PricePackageService],
    controllers: [PricePackageController],
    exports: [PricePackageService],
})
export class PricePackageModule {}
