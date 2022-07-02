import { PricePackage } from './../core/models';
import { SubjectModule } from './../subject/subject.module';
import { UserModule } from './../user/user.module';
import { AuthModule } from './../auth/auth.module';
import { PricePackageRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { PricePackageService } from './price-package.service';
import { PricePackageController } from './price-package.controller';
import { PricePackagesController } from './price-packages.controller';
import { Connection } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([PricePackage]), AuthModule, forwardRef(() => UserModule), SubjectModule],
    providers: [PricePackageService, { provide: PricePackageRepository, useFactory: (connection: Connection) => connection.getCustomRepository(PricePackageRepository), inject: [Connection] }],
    controllers: [PricePackageController, PricePackagesController],
    exports: [PricePackageService],
})
export class PricePackageModule {}
