import { LessonQuizRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { LessonQuizController } from './lesson-quiz.controller';
import { LessonQuizService } from './lesson-quiz.service';

@Module({
    imports: [TypeOrmModule.forFeature([LessonQuizRepository])],
    controllers: [LessonQuizController],
    providers: [LessonQuizService],
    exports: [LessonQuizService],
})
export class LessonQuizModule {}
