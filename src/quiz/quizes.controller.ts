import { QuizDetailService } from './../quiz-detail/quiz-detail.service';
import { ExpertGuard } from './../auth/guard';
import { Controller, Res, UseGuards, Get, UsePipes, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { QuizService } from './quiz.service';
import { QueryJoiValidatorPipe } from '../core/pipe';
import { FilterQuizzesDTO, vFilterQuizzesDTO } from './dto';

@ApiTags('quizzes')
@ApiBearerAuth()
@UseGuards(ExpertGuard)
@Controller('quizzes')
export class QuizzesController {
    constructor(private readonly quizService: QuizService, private readonly quizDetailService: QuizDetailService) {}

    @Get('/')
    @UsePipes(new QueryJoiValidatorPipe(vFilterQuizzesDTO))
    async cGetQuizzes(@Res() res: Response, @Query() queries: FilterQuizzesDTO) {
        const quizzes = await this.quizService.filterQuizzes(queries);

        for (const item of quizzes.data) {
            const questions = (await this.quizDetailService.getQuizDetailsByQuizId(item.id)).map((question) => question.question);
            item.questions = questions;
        }

        return res.send(quizzes);
    }
}
