import { ExamLevelService } from './../exam-level/exam-level.service';
import { QuizTypeService } from './../quiz-type/quiz-type.service';
import { SubjectService } from '../subject/subject.service';
import { ResponseMessage } from './../core/interface';
import { JoiValidatorPipe } from './../core/pipe';
import { ExpertGuard } from './../auth/guard';
import { Body, Controller, Post, Req, Res, UseGuards, UsePipes, HttpException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { QuizService } from './quiz.service';
import { CreateQuizDTO, vCreateQuizDTO } from './dto';
import { Quiz, UserRole } from '../core/models';

@ApiTags('quiz')
@ApiBearerAuth()
@UseGuards(ExpertGuard)
@Controller('quiz')
export class QuizController {
    constructor(
        private readonly quizService: QuizService,
        private readonly subjectService: SubjectService,
        private readonly quizTypeService: QuizTypeService,
        private readonly examLevelService: ExamLevelService,
    ) {}

    @Post('')
    @UsePipes(new JoiValidatorPipe(vCreateQuizDTO))
    async cCreateSlider(@Req() req: Request, @Res() res: Response, @Body() body: CreateQuizDTO) {
        const user = req.user;

        const subject = await this.subjectService.getSubjectByField('id', body.subject);
        if (!subject) throw new HttpException({ subject: ResponseMessage.INVALID_SUBJECT }, StatusCodes.BAD_REQUEST);
        if (user.role.description !== UserRole.ADMIN && subject.assignTo.id !== user.typeId) throw new HttpException({ errorMessage: ResponseMessage.FORBIDDEN }, StatusCodes.FORBIDDEN);

        const type = await this.quizTypeService.getQuizTypeByField('id', body.type);
        if (!type) throw new HttpException({ type: ResponseMessage.INVALID_QUIZ_TYPE }, StatusCodes.BAD_REQUEST);

        const level = await this.examLevelService.getExamLevelByField('id', body.level);
        if (!level) throw new HttpException({ level: ResponseMessage.INVALID_EXAM_LEVEL }, StatusCodes.BAD_REQUEST);

        const newQuiz = new Quiz();
        newQuiz.name = body.name;
        newQuiz.duration = body.duration;
        newQuiz.numberOfQuestion = body.numberOfQuestion;
        newQuiz.passRate = body.passRate;
        newQuiz.isPublic = body.isPublic;
        newQuiz.level = level;
        newQuiz.type = type;
        newQuiz.subject = subject;

        await this.quizService.saveQuiz(newQuiz);

        if (newQuiz.subject.assignTo) {
            newQuiz.subject.assignTo.user.password = '';
            newQuiz.subject.assignTo.user.token = '';
        }

        return res.send(newQuiz);
    }
}
