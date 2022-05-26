import { Module } from '@nestjs/common';
import { LessonTypeService } from './lesson-type.service';
import { LessonTypeController } from './lesson-type.controller';

@Module({
    providers: [LessonTypeService],
    controllers: [LessonTypeController],
})
export class LessonTypeModule {}
