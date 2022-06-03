import { LessonTypeRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { LessonTypeService } from './lesson-type.service';
import { LessonTypeController } from './lesson-type.controller';
import { LessonTypesController } from './lesson-types.controller';

@Module({
    imports: [TypeOrmModule.forFeature([LessonTypeRepository])],
    providers: [LessonTypeService],
    controllers: [LessonTypeController, LessonTypesController],
    exports: [LessonTypeService],
})
export class LessonTypeModule {}
