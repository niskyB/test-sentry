import { QuizResultRepository } from './../core/repositories';
import { QuizResult } from './../core/models';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { QuizResultController } from './quiz-result.controller';
import { QuizResultService } from './quiz-result.service';
import { Connection } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([QuizResult])],
    controllers: [QuizResultController],
    providers: [QuizResultService, { provide: QuizResultRepository, useFactory: (connection: Connection) => connection.getCustomRepository(QuizResultRepository), inject: [Connection] }],
    exports: [QuizResultService],
})
export class QuizResultModule {}
