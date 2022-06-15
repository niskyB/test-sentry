import { Module } from '@nestjs/common';
import { QuizResultController } from './quiz-result.controller';
import { QuizResultService } from './quiz-result.service';

@Module({
  controllers: [QuizResultController],
  providers: [QuizResultService]
})
export class QuizResultModule {}
