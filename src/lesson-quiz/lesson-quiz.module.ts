import { Module } from '@nestjs/common';
import { LessonQuizController } from './lesson-quiz.controller';
import { LessonQuizService } from './lesson-quiz.service';

@Module({
    controllers: [LessonQuizController],
    providers: [LessonQuizService],
})
export class LessonQuizModule {}
