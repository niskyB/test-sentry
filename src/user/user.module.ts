import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository, RoleRepository } from '../core/repositories';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';
import { S3Module } from 'src/core/providers/s3/s3.module';

@Module({
    imports: [forwardRef(() => AuthModule), S3Module, TypeOrmModule.forFeature([UserRepository]), TypeOrmModule.forFeature([RoleRepository])],
    controllers: [UserController, UsersController],
    providers: [UserService],
    exports: [UserService, TypeOrmModule],
})
export class UserModule {}
