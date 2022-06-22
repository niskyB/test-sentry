import { AttendedQuestionService } from './../attended-question/attended-question.service';
import { QuizDetailService } from './../quiz-detail/quiz-detail.service';
import { QuestionService } from './../question/question.service';
import { ExamLevelService } from './../exam-level/exam-level.service';
import { QuizTypeService } from './../quiz-type/quiz-type.service';
import { SubjectService } from '../subject/subject.service';
import { ResponseMessage } from './../core/interface';
import { JoiValidatorPipe } from './../core/pipe';
import { ExpertGuard } from './../auth/guard';
import { Body, Controller, Post, Req, Res, UseGuards, UsePipes, HttpException, Put, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { QuizService } from './quiz.service';
import { CreateQuizDTO, UpdateQuizDTO, vCreateQuizDTO, vUpdateQuizDTO } from './dto';
import { Quiz, QuizDetail, UserRole } from '../core/models';

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
        private readonly questionService: QuestionService,
        private readonly quizDetailService: QuizDetailService,
        private readonly attendedQuestionService: AttendedQuestionService,
    ) {}

    @Post('')
    @UsePipes(new JoiValidatorPipe(vCreateQuizDTO))
    async cCreateQuiz(@Req() req: Request, @Res() res: Response, @Body() body: CreateQuizDTO) {
        const user = req.user;

        const subject = await this.subjectService.getSubjectByField('id', body.subject);
        if (!subject) throw new HttpException({ subject: ResponseMessage.INVALID_SUBJECT }, StatusCodes.BAD_REQUEST);
        if (user.role.description !== UserRole.ADMIN && subject.assignTo.id !== user.typeId) throw new HttpException({ errorMessage: ResponseMessage.FORBIDDEN }, StatusCodes.FORBIDDEN);

        const type = await this.quizTypeService.getQuizTypeByField('id', body.type);
        if (!type) throw new HttpException({ type: ResponseMessage.INVALID_QUIZ_TYPE }, StatusCodes.BAD_REQUEST);

        const level = await this.examLevelService.getExamLevelByField('id', body.quizLevel);
        if (!level) throw new HttpException({ level: ResponseMessage.INVALID_EXAM_LEVEL }, StatusCodes.BAD_REQUEST);

        if (body.questions.length !== body.numberOfQuestion) throw new HttpException({ numberOfQuestion: ResponseMessage.INVALID_NUMBER_OF_QUESTION }, StatusCodes.BAD_REQUEST);

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

        for (const item of body.questions) {
            const question = await this.questionService.getQuestionByField('id', item);
            const quizDetail = new QuizDetail();
            quizDetail.question = question;
            quizDetail.quiz = newQuiz;
            await this.quizDetailService.saveQuizDetail(quizDetail);
        }

        return res.send(newQuiz);
    }

    @Put('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    @UsePipes(new JoiValidatorPipe(vUpdateQuizDTO))
    async cUpdateQuiz(@Req() req: Request, @Res() res: Response, @Body() body: UpdateQuizDTO, @Param('id') id: string) {
        const user = req.user;

        const attendedQuestion = await this.attendedQuestionService.getAttendedQuestionByQuizId(id);
        if (attendedQuestion) throw new HttpException({ errorMessage: ResponseMessage.QUIZ_TAKEN }, StatusCodes.BAD_REQUEST);

        const subject = await this.subjectService.getSubjectByField('id', body.subject);
        if (subject && user.role.description !== UserRole.ADMIN && subject.assignTo.id !== user.typeId) throw new HttpException({ errorMessage: ResponseMessage.FORBIDDEN }, StatusCodes.FORBIDDEN);

        const quiz = await this.quizService.getQuizByField('id', id);
        body.numberOfQuestion = body.numberOfQuestion > 0 ? body.numberOfQuestion : quiz.numberOfQuestion;

        if (body.questions.length === 0) {
            if (body.numberOfQuestion !== quiz.questions.length) throw new HttpException({ questions: ResponseMessage.INVALID_NUMBER_OF_QUESTION }, StatusCodes.BAD_REQUEST);
        } else {
            if (body.numberOfQuestion !== body.questions.length) throw new HttpException({ questions: ResponseMessage.INVALID_NUMBER_OF_QUESTION }, StatusCodes.BAD_REQUEST);
            for (const item of body.questions) {
                const question = await this.questionService.getQuestionByField('id', item);
                let quizDetail = await this.quizDetailService.getQuizDetailByQuizIdAndQuestionId(quiz.id, question.id);
                if (!quizDetail) {
                    quizDetail = new QuizDetail();
                    quizDetail.question = question;
                    quizDetail.quiz = quiz;
                    await this.quizDetailService.saveQuizDetail(quizDetail);
                }
            }
        }

        const type = await this.quizTypeService.getQuizTypeByField('id', body.type);
        const level = await this.examLevelService.getExamLevelByField('id', body.quizLevel);

        quiz.type = type || quiz.type;
        quiz.level = level || quiz.level;
        quiz.subject = subject || quiz.subject;
        quiz.name = body.name || quiz.name;
        quiz.duration = body.duration > 0 ? body.duration : quiz.duration;
        quiz.passRate = body.passRate > 0 ? body.passRate : quiz.passRate;
        quiz.numberOfQuestion = body.numberOfQuestion;
        quiz.isPublic = body.isPublic === null || body.isPublic === undefined ? quiz.isPublic : body.isPublic;

        await this.quizService.saveQuiz(quiz);
        return res.send(quiz);
    }

    @Delete('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    async cDeleteQuiz(@Req() req: Request, @Res() res: Response, @Body() body: UpdateQuizDTO, @Param('id') id: string) {
        const user = req.user;
        const quiz = await this.quizService.getQuizByField('id', id);

        if (!quiz) throw new HttpException({ quiz: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);

        const attendedQuestion = await this.attendedQuestionService.getAttendedQuestionByQuizId(id);
        if (attendedQuestion) throw new HttpException({ errorMessage: ResponseMessage.QUIZ_TAKEN }, StatusCodes.BAD_REQUEST);

        if (user.role.description !== UserRole.ADMIN && quiz.subject.assignTo.id !== user.typeId) throw new HttpException({ errorMessage: ResponseMessage.FORBIDDEN }, StatusCodes.FORBIDDEN);

        const quizDetails = await this.quizDetailService.getQuizDetailsByQuizId(quiz.id);
        for (const item of quizDetails) {
            await this.quizDetailService.deleteQuizDetail(item);
        }
        await this.quizService.deleteQuiz(quiz);

        return res.send();
    }
}
