import { Role, User } from './../core/models';
import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository, RoleRepository } from '../core/repositories';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';
import { S3Module } from 'src/core/providers/s3/s3.module';
import { Connection } from 'typeorm';

@Module({
    imports: [forwardRef(() => AuthModule), S3Module, TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Role])],
    controllers: [UserController, UsersController],
    providers: [
        UserService,
        { provide: UserRepository, useFactory: (connection: Connection) => connection.getCustomRepository(UserRepository), inject: [Connection] },
        { provide: RoleRepository, useFactory: (connection: Connection) => connection.getCustomRepository(RoleRepository), inject: [Connection] },
    ],
    exports: [UserService, TypeOrmModule],
})
export class UserModule {}
