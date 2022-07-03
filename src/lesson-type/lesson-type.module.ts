import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { LessonType } from './../core/models';
import { LessonTypeRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { LessonTypeService } from './lesson-type.service';
import { LessonTypeController } from './lesson-type.controller';
import { LessonTypesController } from './lesson-types.controller';
import { Connection } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([LessonType]), AuthModule, UserModule],
    providers: [LessonTypeService, { provide: LessonTypeRepository, useFactory: (connection: Connection) => connection.getCustomRepository(LessonTypeRepository), inject: [Connection] }],
    controllers: [LessonTypeController, LessonTypesController],
    exports: [LessonTypeService],
})
export class LessonTypeModule {}
