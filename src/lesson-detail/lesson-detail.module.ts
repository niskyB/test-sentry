import { Module } from '@nestjs/common';
import { LessonDetailController } from './lesson-detail.controller';
import { LessonDetailService } from './lesson-detail.service';

@Module({
    controllers: [LessonDetailController],
    providers: [LessonDetailService],
})
export class LessonDetailModule {}
