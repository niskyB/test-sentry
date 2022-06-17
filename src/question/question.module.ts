import { AnswerModule } from './../answer/answer.module';
import { Question } from './../core/models';
import { QuestionsController } from './questions.controller';
import { LessonModule } from './../lesson/lesson.module';
import { UserModule } from './../user/user.module';
import { AuthModule } from './../auth/auth.module';
import { DimensionModule } from './../dimension/dimension.module';
import { S3Module } from '../core/providers/s3/s3.module';
import { QuestionRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { Connection } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Question]), S3Module, DimensionModule, AuthModule, UserModule, LessonModule, AnswerModule],
    controllers: [QuestionController, QuestionsController],
    providers: [QuestionService, { provide: QuestionRepository, useFactory: (connection: Connection) => connection.getCustomRepository(QuestionRepository), inject: [Connection] }],
    exports: [QuestionService],
})
export class QuestionModule {}
