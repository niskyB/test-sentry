import { QuizDetailRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { QuizDetailController } from './quiz-detail.controller';
import { QuizDetailService } from './quiz-detail.service';
import { QuizDetail } from '../core/models';
import { Connection } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([QuizDetail])],
    controllers: [QuizDetailController],
    providers: [QuizDetailService, { provide: QuizDetailRepository, useFactory: (connection: Connection) => connection.getCustomRepository(QuizDetailRepository), inject: [Connection] }],
    exports: [QuizDetailService],
})
export class QuizDetailModule {}
