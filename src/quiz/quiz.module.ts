import { UserModule } from '../user/user.module';
import { AuthModule } from './../auth/auth.module';
import { ExamLevelModule } from './../exam-level/exam-level.module';
import { QuizTypeModule } from './../quiz-type/quiz-type.module';
import { SubjectModule } from '../subject/subject.module';
import { Quiz } from './../core/models';
import { QuizRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { Connection } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Quiz]), SubjectModule, QuizTypeModule, ExamLevelModule, AuthModule, UserModule],
    controllers: [QuizController],
    providers: [QuizService, { provide: QuizRepository, useFactory: (connection: Connection) => connection.getCustomRepository(QuizRepository), inject: [Connection] }],
    exports: [QuizService],
})
export class QuizModule {}
