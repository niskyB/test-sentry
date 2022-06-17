import { Module } from '@nestjs/common';
import { AttendedQuestionController } from './attended-question.controller';
import { AttendedQuestionService } from './attended-question.service';

@Module({
    controllers: [AttendedQuestionController],
    providers: [AttendedQuestionService],
})
export class AttendedQuestionModule {}
