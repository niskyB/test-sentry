import { Module } from '@nestjs/common';
import { UserAnswerController } from './user-answer.controller';
import { UserAnswerService } from './user-answer.service';

@Module({
  controllers: [UserAnswerController],
  providers: [UserAnswerService]
})
export class UserAnswerModule {}
