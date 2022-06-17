import { Module } from '@nestjs/common';
import { QuestionLevelController } from './question-level.controller';
import { QuestionLevelService } from './question-level.service';

@Module({
  controllers: [QuestionLevelController],
  providers: [QuestionLevelService]
})
export class QuestionLevelModule {}
