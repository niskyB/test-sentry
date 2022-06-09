import { SubjectTopicRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SubjectTopicController } from './subject-topic.controller';
import { SubjectTopicService } from './subject-topic.service';

@Module({
    imports: [TypeOrmModule.forFeature([SubjectTopicRepository])],
    controllers: [SubjectTopicController],
    providers: [SubjectTopicService],
    exports: [SubjectTopicService],
})
export class SubjectTopicModule {}
