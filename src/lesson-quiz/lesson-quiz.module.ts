import { LessonQuiz } from './../core/models';
import { LessonQuizRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { LessonQuizController } from './lesson-quiz.controller';
import { LessonQuizService } from './lesson-quiz.service';
import { Connection } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([LessonQuiz])],
    controllers: [LessonQuizController],
    providers: [LessonQuizService, { provide: LessonQuizRepository, useFactory: (connection: Connection) => connection.getCustomRepository(LessonQuizRepository), inject: [Connection] }],
    exports: [LessonQuizService],
})
export class LessonQuizModule {}
