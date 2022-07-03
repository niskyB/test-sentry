import { Lesson } from './../core/models';
import { QuizModule } from './../quiz/quiz.module';
import { LessonQuizModule } from './../lesson-quiz/lesson-quiz.module';
import { LessonDetailModule } from './../lesson-detail/lesson-detail.module';
import { SubjectTopicModule } from './../subject-topic/subject-topic.module';
import { SubjectModule } from './../subject/subject.module';
import { LessonTypeModule } from './../lesson-type/lesson-type.module';
import { UserModule } from './../user/user.module';
import { AuthModule } from './../auth/auth.module';
import { LessonRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { LessonsController } from './lessons.controller';
import { Connection } from 'typeorm';
import { FilterModule } from '../core/providers';

@Module({
    imports: [
        TypeOrmModule.forFeature([Lesson]),
        AuthModule,
        UserModule,
        LessonTypeModule,
        SubjectModule,
        SubjectTopicModule,
        LessonDetailModule,
        LessonQuizModule,
        QuizModule,
        UserModule,
        FilterModule,
    ],
    controllers: [LessonController, LessonsController],
    providers: [LessonService, { provide: LessonRepository, useFactory: (connection: Connection) => connection.getCustomRepository(LessonRepository), inject: [Connection] }],
    exports: [LessonService],
})
export class LessonModule {}
