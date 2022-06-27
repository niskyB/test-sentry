import { QuizDetailService } from '../quiz-detail/quiz-detail.service';
import { CommonGuard, ExpertGuard } from '../auth/guard';
import { Controller, Res, UseGuards, Get, UsePipes, Query, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { QuizService } from './quiz.service';
import { QueryJoiValidatorPipe } from '../core/pipe';
import { FilterQuizzesDTO, FilterSimulationExamsDTO, vFilterQuizzesDTO, vFilterSimulationExamsDTO } from './dto';

@ApiTags('quizzes')
@ApiBearerAuth()
@Controller('quizzes')
export class QuizzesController {
    constructor(private readonly quizService: QuizService, private readonly quizDetailService: QuizDetailService) {}

    @Get('/')
    @UseGuards(ExpertGuard)
    @UsePipes(new QueryJoiValidatorPipe(vFilterQuizzesDTO))
    async cGetQuizzes(@Res() res: Response, @Query() queries: FilterQuizzesDTO) {
        const quizzes = await this.quizService.filterQuizzes(queries);

        for (const item of quizzes.data) {
            const questions = (await this.quizDetailService.getQuizDetailsByQuizId(item.id)).map((question) => question.question);
            item.questions = questions;
        }

        return res.send(quizzes);
    }

    @Get('/simulations')
    @UseGuards(CommonGuard)
    @UsePipes(new QueryJoiValidatorPipe(vFilterSimulationExamsDTO))
    async cGetSimulationExams(@Req() req: Request, @Res() res: Response, @Query() queries: FilterSimulationExamsDTO) {
        const { subject, name, currentPage, pageSize } = queries;
        const quizzes = await this.quizService.filterSimulationExams(req.user.id, subject, name, currentPage, pageSize);

        for (const item of quizzes.data) {
            const questions = (await this.quizDetailService.getQuizDetailsByQuizId(item.id)).map((question) => question.question);
            item.questions = questions;
        }

        return res.send(quizzes);
    }
}
