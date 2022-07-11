import { RegistrationService } from './../registration/registration.service';
import { CommonGuard } from './../auth/guard';
import { QuizResultService } from './../quiz-result/quiz-result.service';
import { Controller, Res, Param, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AttendedQuestion } from '../core/models';

@ApiTags('quiz result')
@ApiBearerAuth()
@UseGuards(CommonGuard)
@Controller('quiz-result')
export class QuizResultController {
    constructor(private readonly quizResultService: QuizResultService, private readonly registrationService: RegistrationService) {}

    @Get('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    async cGetQuiz(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        const quizResult = (await this.quizResultService.getQuizResultByField('id', id)) as any;

        await this.registrationService.checkUserAccess(quizResult.attendedQuestions[0].questionInQuiz.quiz.subject.id, req.user.email);

        for (let i = 0; i < quizResult.attendedQuestions.length; i++) {
            const question = quizResult.attendedQuestions[i] as AttendedQuestion;
            const answerList = question.userAnswers.map((item) => item.answer.id);
            quizResult.attendedQuestions[i].userAnswers = answerList;
        }

        if (quizResult.customer) {
            quizResult.customer.user.password = '';
            quizResult.customer.user.token = '';
        }
        return res.send(quizResult);
    }
}
