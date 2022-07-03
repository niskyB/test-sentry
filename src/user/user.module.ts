import { RegistrationModule } from './../registration/registration.module';
import { DateModule, FilterModule, S3Module } from './../core/providers';
import { Role, User } from './../core/models';
import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository, RoleRepository } from '../core/repositories';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';
import { Connection } from 'typeorm';

@Module({
    imports: [forwardRef(() => AuthModule), S3Module, TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Role]), FilterModule, DateModule, RegistrationModule, FilterModule],
    controllers: [UserController, UsersController],
    providers: [
        UserService,
        { provide: UserRepository, useFactory: (connection: Connection) => connection.getCustomRepository(UserRepository), inject: [Connection] },
        { provide: RoleRepository, useFactory: (connection: Connection) => connection.getCustomRepository(RoleRepository), inject: [Connection] },
    ],
    exports: [UserService, TypeOrmModule],
})
export class UserModule {}
