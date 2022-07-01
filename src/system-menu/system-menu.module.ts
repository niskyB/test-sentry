import { UserModule } from './../user/user.module';
import { AuthModule } from './../auth/auth.module';
import { FilterModule } from './../core/providers/filter/filter.module';
import { SystemMenusController } from './system-menus.controller';
import { SystemMenuRepository } from './../core/repositories';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { SystemMenu } from '../core/models';
import { SystemMenuController } from './system-menu.controller';
import { SystemMenuService } from './system-menu.service';

@Module({
    imports: [TypeOrmModule.forFeature([SystemMenu]), FilterModule, AuthModule, UserModule],
    controllers: [SystemMenuController, SystemMenusController],
    providers: [SystemMenuService, { provide: SystemMenuRepository, useFactory: (connection: Connection) => connection.getCustomRepository(SystemMenuRepository), inject: [Connection] }],
    exports: [SystemMenuService],
})
export class SystemMenuModule {}
