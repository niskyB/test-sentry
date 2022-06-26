import { UserModule } from './../user/user.module';
import { AuthModule } from './../auth/auth.module';
import { QuizResultRepository } from './../core/repositories';
import { QuizResult } from './../core/models';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { QuizResultController } from './quiz-result.controller';
import { QuizResultService } from './quiz-result.service';
import { Connection } from 'typeorm';
import { QuizResultsController } from './quiz-results.controller';

@Module({
    imports: [TypeOrmModule.forFeature([QuizResult]), AuthModule, UserModule],
    controllers: [QuizResultController, QuizResultsController],
    providers: [QuizResultService, { provide: QuizResultRepository, useFactory: (connection: Connection) => connection.getCustomRepository(QuizResultRepository), inject: [Connection] }],
    exports: [QuizResultService],
})
export class QuizResultModule {}
