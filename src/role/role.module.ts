import { UserModule } from './../user/user.module';
import { AuthModule } from './../auth/auth.module';
import { RolesController } from './roles.controller';
import { RoleRepository } from './../core/repositories';
import { Role } from './../core/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Connection } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Role]), AuthModule, UserModule],
    controllers: [RoleController, RolesController],
    providers: [RoleService, { provide: RoleRepository, useFactory: (connection: Connection) => connection.getCustomRepository(RoleRepository), inject: [Connection] }],
    exports: [RoleService],
})
export class RoleModule {}
