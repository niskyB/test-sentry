import { QuizResultService } from './../quiz-result/quiz-result.service';
import { Controller, Res, Param, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('quiz result')
@ApiBearerAuth()
@Controller('quiz-result')
export class QuizResultController {
    constructor(private readonly quizResultService: QuizResultService) {}

    @Get('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    async cGetQuiz(@Res() res: Response, @Param('id') id: string) {
        const quizResult = await this.quizResultService.getQuizResultByField('id', id);

        if (quizResult.customer) {
            quizResult.customer.user.password = '';
            quizResult.customer.user.token = '';
        }
        return res.send(quizResult);
    }
}
