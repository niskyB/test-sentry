import { UserAnswerRepository } from './../core/repositories';
import { UserAnswer } from './../core/models';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserAnswerController } from './user-answer.controller';
import { UserAnswerService } from './user-answer.service';
import { Connection } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([UserAnswer])],
    controllers: [UserAnswerController],
    providers: [UserAnswerService, { provide: UserAnswerRepository, useFactory: (connection: Connection) => connection.getCustomRepository(UserAnswerRepository), inject: [Connection] }],
    exports: [UserAnswerService],
})
export class UserAnswerModule {}
