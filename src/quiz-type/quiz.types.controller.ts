import { QuizTypeService } from './quiz-type.service';
import { Controller, Res, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('quiz types')
@ApiBearerAuth()
@Controller('quiz-types')
export class QuizTypesController {
    constructor(private readonly quizTypeService: QuizTypeService) {}

    @Get('')
    async cGetAllQuizTypes(@Res() res: Response) {
        const questionLevels = await this.quizTypeService.getAllQuizTypes();
        return res.send(questionLevels);
    }
}
