import { SubjectTopic } from './../core/models';
import { SubjectTopicRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SubjectTopicController } from './subject-topic.controller';
import { SubjectTopicService } from './subject-topic.service';
import { Connection } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([SubjectTopic])],
    controllers: [SubjectTopicController],
    providers: [SubjectTopicService, { provide: SubjectTopicRepository, useFactory: (connection: Connection) => connection.getCustomRepository(SubjectTopicRepository), inject: [Connection] }],
    exports: [SubjectTopicService],
})
export class SubjectTopicModule {}
