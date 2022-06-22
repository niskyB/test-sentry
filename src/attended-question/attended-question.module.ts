import { AttendedQuestionRepository } from './../core/repositories';
import { AttendedQuestion } from './../core/models';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AttendedQuestionController } from './attended-question.controller';
import { AttendedQuestionService } from './attended-question.service';
import { Connection } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([AttendedQuestion])],
    controllers: [AttendedQuestionController],
    providers: [
        AttendedQuestionService,
        { provide: AttendedQuestionRepository, useFactory: (connection: Connection) => connection.getCustomRepository(AttendedQuestionRepository), inject: [Connection] },
    ],
    exports: [AttendedQuestionService],
})
export class AttendedQuestionModule {}
