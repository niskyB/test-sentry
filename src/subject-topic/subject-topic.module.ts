import { Module } from '@nestjs/common';
import { SubjectTopicController } from './subject-topic.controller';
import { SubjectTopicService } from './subject-topic.service';

@Module({
    controllers: [SubjectTopicController],
    providers: [SubjectTopicService],
})
export class SubjectTopicModule {}
