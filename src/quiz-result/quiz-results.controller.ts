import { QueryJoiValidatorPipe } from './../core/pipe';
import { CommonGuard } from './../auth/guard';
import { QuizResultService } from './../quiz-result/quiz-result.service';
import { Controller, Res, Get, Req, UseGuards, UsePipes, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { FilterQuizResultsDTO, vFilterQuizResultsDTO } from './dto';

@ApiTags('quiz results')
@ApiBearerAuth()
@Controller('quiz-results')
export class QuizResultsController {
    constructor(private readonly quizResultService: QuizResultService) {}

    @Get('/')
    @UseGuards(CommonGuard)
    @UsePipes(new QueryJoiValidatorPipe(vFilterQuizResultsDTO))
    async cGetQuiz(@Req() req: Request, @Res() res: Response, @Body() body: FilterQuizResultsDTO) {
        const quizResults = await this.quizResultService.getQuizResultByUserId(req.user.id, body.subject, body.currentPage, body.pageSize);

        quizResults.data = quizResults.data.map((item) => {
            item.customer.user.password = '';
            item.customer.user.token = '';
            return item;
        }, []);

        return res.send(quizResults);
    }
}
