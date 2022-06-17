import { AnswerRepository } from './../core/repositories';
import { Answer } from './../core/models';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';
import { Connection } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Answer])],
    controllers: [AnswerController],
    providers: [AnswerService, { provide: AnswerRepository, useFactory: (connection: Connection) => connection.getCustomRepository(AnswerRepository), inject: [Connection] }],
    exports: [AnswerService],
})
export class AnswerModule {}
