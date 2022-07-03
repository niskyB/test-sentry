import { Module } from '@nestjs/common';
import { QuestionInQuizController } from './question-in-quiz.controller';
import { QuestionInQuizService } from './question-in-quiz.service';

@Module({
    controllers: [QuestionInQuizController],
    providers: [QuestionInQuizService],
})
export class QuestionInQuizModule {}
