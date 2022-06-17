import { Controller, Res, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { QuestionLevelService } from './question-level.service';

@ApiTags('question levels')
@ApiBearerAuth()
@Controller('question-levels')
export class QuestionLevelsController {
    constructor(private readonly questionLevelService: QuestionLevelService) {}

    @Get('')
    async cGetAllQuestionLevels(@Res() res: Response) {
        const questionLevels = await this.questionLevelService.getAllQuestionLevel();
        return res.send(questionLevels);
    }
}
