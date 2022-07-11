import { RegistrationService } from './../registration/registration.service';
import { DimensionService } from './../dimension/dimension.service';
import { LessonService } from './../lesson/lesson.service';
import { AnswerService } from './../answer/answer.service';
import { UserAnswerService } from './../user-answer/user-answer.service';
import { CustomerService } from './../customer/customer.service';
import { QuizResultService } from './../quiz-result/quiz-result.service';
import { AttendedQuestionService } from './../attended-question/attended-question.service';
import { QuizDetailService } from './../quiz-detail/quiz-detail.service';
import { QuestionService } from './../question/question.service';
import { ExamLevelService } from './../exam-level/exam-level.service';
import { QuizTypeService } from './../quiz-type/quiz-type.service';
import { SubjectService } from '../subject/subject.service';
import { ResponseMessage } from './../core/interface';
import { JoiValidatorPipe } from './../core/pipe';
import { CommonGuard, ExpertGuard } from './../auth/guard';
import { Body, Controller, Post, Req, Res, UseGuards, UsePipes, HttpException, Put, Param, Delete, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { QuizService } from './quiz.service';
import { CreatePracticeQuizDTO, CreateQuizDTO, SubmitQuizDTO, UpdateQuizDTO, vCreatePracticeQuizDTO, vCreateQuizDTO, vSubmitQuizDTO, vUpdateQuizDTO } from './dto';
import { Quiz, QuizDetail, UserRole, QuizResult, AttendedQuestion, UserAnswer, Question } from '../core/models';

@ApiTags('quiz')
@ApiBearerAuth()
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
        private readonly quizResultService: QuizResultService,
        private readonly customerService: CustomerService,
        private readonly userAnswerService: UserAnswerService,
        private readonly answerService: AnswerService,
        private readonly lessonService: LessonService,
        private readonly dimensionService: DimensionService,
        private readonly registrationService: RegistrationService,
    ) {}

    @Get('/:id')
    @UseGuards(CommonGuard)
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    async cGetQuiz(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        const quiz = await this.quizService.getQuizByField('id', id);
        if (req.user.role.description !== UserRole.ADMIN && req.user.role.description !== UserRole.EXPERT) await this.registrationService.checkUserAccess(quiz.subject.id, req.user.email);
        quiz.questions = [];
        const quizDetail = await this.quizDetailService.getQuizDetailsByQuizId(id);

        for (const item of quizDetail) {
            quiz.questions.push(item.question);
        }

        if (quiz.subject.assignTo) {
            quiz.subject.assignTo.user.password = '';
            quiz.subject.assignTo.user.token = '';
        }
        return res.send(quiz);
    }

    @Post('/handle/:id')
    @UseGuards(CommonGuard)
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    async cHandleQuiz(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        const quiz = await this.quizService.getQuizByField('id', id);
        await this.registrationService.checkUserAccess(quiz.subject.id, req.user.email);
        if (!quiz) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);

        let quizResult = new QuizResult();
        quizResult.createdAt = new Date().toISOString();

        const customer = await this.customerService.getCustomerByUserId(req.user.id);
        if (!customer) throw new HttpException({ errorMessage: ResponseMessage.UNAUTHORIZED }, StatusCodes.UNAUTHORIZED);
        quizResult.customer = customer;

        quizResult = await this.quizResultService.saveQuizResult(quizResult);
        quizResult.attendedQuestions = [];

        const quizDetail = await this.quizDetailService.getQuizDetailsByQuizId(id);
        await Promise.all(
            quizDetail.map(async (item) => {
                let attendedQuestion = new AttendedQuestion();
                attendedQuestion.questionInQuiz = item;
                attendedQuestion.quizResult = quizResult;
                attendedQuestion = await this.attendedQuestionService.saveAttendedQuestion(attendedQuestion);
                quizResult.attendedQuestions.push(attendedQuestion);
            }),
        );

        return res.send(quizResult.id);
    }

    @Post('/submit')
    @UseGuards(CommonGuard)
    @UsePipes(new JoiValidatorPipe(vSubmitQuizDTO))
    async cSubmitQuiz(@Res() res: Response, @Body() body: SubmitQuizDTO) {
        const quizResult = await this.quizResultService.getQuizResultByAttendedQuestionId(body.data[0].attendedQuestionId);
        if (!quizResult) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);
        let correctAnswers = 0;

        await Promise.all(
            body.data.map(async (item) => {
                let attendedQuestion = await this.attendedQuestionService.getAttendedQuestionByField('id', item.attendedQuestionId);
                attendedQuestion.isMarked = item.isMarked;
                attendedQuestion = await this.attendedQuestionService.saveAttendedQuestion(attendedQuestion);
                const numberOfCorrectAnswer = await this.answerService.getNumberOfCorrectAnswer(attendedQuestion.questionInQuiz.question.id);
                let isCorrect = true;
                let userAnswerCorrect = 0;

                await Promise.all(
                    item.answerId.map(async (id) => {
                        const answer = await this.answerService.getAnswerByField('id', id);
                        const userAnswer = new UserAnswer();
                        userAnswer.attendedQuestion = attendedQuestion;
                        userAnswer.answer = answer;
                        if (!answer.isCorrect) isCorrect = false;
                        await this.userAnswerService.saveUserAnswer(userAnswer);
                        userAnswerCorrect++;
                    }),
                );
                if (isCorrect && numberOfCorrectAnswer === userAnswerCorrect) correctAnswers++;
            }),
        );

        quizResult.rate = correctAnswers / quizResult.attendedQuestions[0].questionInQuiz.quiz.numberOfQuestion;
        try {
            await this.quizResultService.updateQuizResult(quizResult);
        } catch (err) {
            console.log(err);
        }

        return res.send(quizResult);
    }

    @Post('/practice')
    @UseGuards(CommonGuard)
    @UsePipes(new JoiValidatorPipe(vCreatePracticeQuizDTO))
    async cCreatePracticeQuiz(@Req() req: Request, @Res() res: Response, @Body() body: CreatePracticeQuizDTO) {
        const { subject: subjectId, subjectTopic: subjectTopicId, dimension: dimensionId } = body;
        await this.registrationService.checkUserAccess(subjectId, req.user.email);

        const subject = await this.subjectService.getSubjectByField('id', subjectId);
        if (!subject) throw new HttpException({ subject: ResponseMessage.INVALID_SUBJECT }, StatusCodes.BAD_REQUEST);

        const questions = await this.questionService.getQuestionByLessonAndDimension(subject.id, subjectTopicId, dimensionId);

        if (!questions || questions.length === 0) throw new HttpException({ errorMessage: ResponseMessage.NO_QUESTION_FOUND }, StatusCodes.BAD_REQUEST);

        const subjectTopic = await this.lessonService.getLessonByField('id', subjectTopicId);
        const dimension = await this.dimensionService.getDimensionByField('id', dimensionId);
        const type = await this.quizTypeService.getQuizTypeByField('description', 'Quiz Practice');
        const level = await this.examLevelService.getExamLevelByField('name', 'Easy');

        let newQuiz = new Quiz();
        newQuiz.isPublic = false;
        newQuiz.name = `Practice - ${subject.name} - ${subjectTopic ? subjectTopic.name : 'All'} - ${dimension ? dimension.name : 'All'}`;
        newQuiz.passRate = 0;
        newQuiz.subject = subject;
        newQuiz.type = type;
        newQuiz.level = level;
        if (body.numberOfQuestion >= questions.length) {
            newQuiz.questions = questions;
        } else {
            const selectedQuestions = new Set<Question>();
            while (selectedQuestions.size < body.numberOfQuestion) {
                const random = Math.floor(Math.random() * questions.length);
                selectedQuestions.add(questions[random]);
            }
            newQuiz.questions = Array.from(selectedQuestions);
        }
        body.numberOfQuestion = body.numberOfQuestion <= questions.length ? body.numberOfQuestion : questions.length;
        newQuiz.duration = body.numberOfQuestion;
        newQuiz.numberOfQuestion = body.numberOfQuestion;

        newQuiz = await this.quizService.saveQuiz(newQuiz);
        await Promise.all(
            newQuiz.questions.map(async (item) => {
                const quizDetail = new QuizDetail();
                quizDetail.question = item;
                quizDetail.quiz = newQuiz;
                await this.quizDetailService.saveQuizDetail(quizDetail);
            }),
        );

        let quizResult = new QuizResult();
        quizResult.createdAt = new Date().toISOString();

        const customer = await this.customerService.getCustomerByUserId(req.user.id);
        if (!customer) throw new HttpException({ errorMessage: ResponseMessage.UNAUTHORIZED }, StatusCodes.UNAUTHORIZED);
        quizResult.customer = customer;

        quizResult = await this.quizResultService.saveQuizResult(quizResult);
        quizResult.attendedQuestions = [];
        const quizDetail = await this.quizDetailService.getQuizDetailsByQuizId(newQuiz.id);
        await Promise.all(
            quizDetail.map(async (item) => {
                let attendedQuestion = new AttendedQuestion();
                attendedQuestion.questionInQuiz = item;
                attendedQuestion.quizResult = quizResult;
                attendedQuestion = await this.attendedQuestionService.saveAttendedQuestion(attendedQuestion);
                quizResult.attendedQuestions.push(attendedQuestion);
            }),
        );

        return res.send(quizResult.id);
    }

    @Post('')
    @UseGuards(ExpertGuard)
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

        await Promise.all(
            body.questions.map(async (item) => {
                const question = await this.questionService.getQuestionByField('id', item);
                const quizDetail = new QuizDetail();
                quizDetail.question = question;
                quizDetail.quiz = newQuiz;
                await this.quizDetailService.saveQuizDetail(quizDetail);
            }),
        );

        return res.send(newQuiz);
    }

    @Put('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    @UseGuards(ExpertGuard)
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
            await Promise.all(
                body.questions.map(async (item) => {
                    const question = await this.questionService.getQuestionByField('id', item);
                    let quizDetail = await this.quizDetailService.getQuizDetailByQuizIdAndQuestionId(quiz.id, question.id);
                    if (!quizDetail) {
                        quizDetail = new QuizDetail();
                        quizDetail.question = question;
                        quizDetail.quiz = quiz;
                        await this.quizDetailService.saveQuizDetail(quizDetail);
                    }
                }),
            );
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
    @UseGuards(ExpertGuard)
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    async cDeleteQuiz(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        const user = req.user;
        const quiz = await this.quizService.getQuizByField('id', id);

        if (!quiz) throw new HttpException({ quiz: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);

        const attendedQuestion = await this.attendedQuestionService.getAttendedQuestionByQuizId(id);
        if (attendedQuestion) throw new HttpException({ errorMessage: ResponseMessage.QUIZ_TAKEN }, StatusCodes.BAD_REQUEST);

        if (user.role.description !== UserRole.ADMIN && quiz.subject.assignTo.id !== user.typeId) throw new HttpException({ errorMessage: ResponseMessage.FORBIDDEN }, StatusCodes.FORBIDDEN);

        const quizDetails = await this.quizDetailService.getQuizDetailsByQuizId(quiz.id);
        await Promise.all(
            quizDetails.map(async (item) => {
                await this.quizDetailService.deleteQuizDetail(item);
            }),
        );
        await this.quizService.deleteQuiz(quiz);

        return res.send();
    }
}
