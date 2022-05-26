import { LessonTypeRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { LessonTypeService } from './lesson-type.service';
import { LessonTypeController } from './lesson-type.controller';

@Module({
    imports: [TypeOrmModule.forFeature([LessonTypeRepository])],
    providers: [LessonTypeService],
    controllers: [LessonTypeController],
    exports: [LessonTypeService],
})
export class LessonTypeModule {}
