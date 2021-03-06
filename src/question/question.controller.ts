import { QuizDetailService } from './../quiz-detail/quiz-detail.service';
import { QuestionLevelService } from './../question-level/question-level.service';
import { AnswerService } from './../answer/answer.service';
import { LessonService } from './../lesson/lesson.service';
import { CommonGuard, ExpertGuard } from './../auth/guard';
import { DimensionService } from './../dimension/dimension.service';
import { S3Service } from '../core/providers';
import { Answer, Question, Quiz, QuizDetail } from './../core/models';
import { JoiValidatorPipe } from './../core/pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { QuestionService } from './question.service';
import { Body, Controller, Get, HttpException, Param, Post, Put, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ResponseMessage } from '../core/interface';
import { StatusCodes } from 'http-status-codes';
import { CreateQuestionDTO, UpdateQuestionDTO, vCreateQuestionDTO, vUpdateQuestionDTO } from './dto';
import { QuizService } from 'src/quiz/quiz.service';

@ApiTags('question')
@ApiBearerAuth()
@Controller('question')
export class QuestionController {
    constructor(
        private readonly questionService: QuestionService,
        private readonly s3Service: S3Service,
        private readonly dimensionService: DimensionService,
        private readonly lessonService: LessonService,
        private readonly answerService: AnswerService,
        private readonly questionLevelService: QuestionLevelService,
        private readonly quizDetailService: QuizDetailService,
        private readonly quizService: QuizService,
    ) {}

    @Get('/:id')
    @UseGuards(CommonGuard)
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    async cGetQuestionById(@Param('id') id: string, @Res() res: Response) {
        const question = await this.questionService.getQuestionByField('id', id);

        if (!question) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);

        return res.send(question);
    }

    @Post('')
    @UseGuards(ExpertGuard)
    @UseInterceptors(FileInterceptor('image'))
    @UsePipes(new JoiValidatorPipe(vCreateQuestionDTO))
    async cCreateQuestion(@Res() res: Response, @Body() body: CreateQuestionDTO, @UploadedFile() file: Express.Multer.File) {
        const answers = JSON.parse(body.answers) as Answer[];

        const countCorrect = answers.reduce((total, item) => {
            if (item.isCorrect) return total + 1;
            return total;
        }, 0);

        if (countCorrect <= 0) throw new HttpException({ errorMessage: ResponseMessage.QUESTION_ANSWER_CORRECT_ERROR }, StatusCodes.BAD_REQUEST);
        if (countCorrect > 1 && !body.isMultipleChoice) throw new HttpException({ errorMessage: ResponseMessage.SINGLE_CHOICE_ERROR }, StatusCodes.BAD_REQUEST);
        if (countCorrect <= 1 && body.isMultipleChoice) throw new HttpException({ errorMessage: ResponseMessage.MULTIPLE_CHOICE_ERROR }, StatusCodes.BAD_REQUEST);

        const questionLevel = await this.questionLevelService.getOneByField('id', body.questionLevel);

        const newQuestion = new Question();
        newQuestion.content = body.content;
        newQuestion.audioLink = body.audioLink;
        newQuestion.videoLink = body.videoLink;
        newQuestion.isMultipleChoice = body.isMultipleChoice;
        newQuestion.explanation = body.explanation;
        newQuestion.isActive = body.isActive === null || body.isActive === undefined ? newQuestion.isActive : body.isActive;
        newQuestion.questionLevel = questionLevel;
        newQuestion.dimensions = [];

        if (file) {
            const result = await this.s3Service.uploadFile(file);
            if (result) newQuestion.imageUrl = result.Location;
            else throw new HttpException({ errorMessage: ResponseMessage.SOMETHING_WRONG }, StatusCodes.INTERNAL_SERVER_ERROR);
        }
        if (body.imageUrl) newQuestion.imageUrl = body.imageUrl;

        const dimensions = body.dimensions.split(',');
        await Promise.all(
            dimensions.map(async (item) => {
                if (item) {
                    const dimension = await this.dimensionService.getDimensionByField('id', item);
                    if (!dimension) throw new HttpException({ dimensions: ResponseMessage.INVALID_DIMENSION }, StatusCodes.BAD_REQUEST);
                    newQuestion.dimensions.push(dimension);
                }
            }),
        );

        if (newQuestion.dimensions.length === 0) throw new HttpException({ dimensions: ResponseMessage.INVALID_DIMENSION }, StatusCodes.BAD_REQUEST);
        const lesson = await this.lessonService.getLessonByField('id', body.lesson);
        if (!lesson) throw new HttpException({ lesson: ResponseMessage.INVALID_LESSON }, StatusCodes.BAD_REQUEST);

        newQuestion.lesson = lesson;
        await this.questionService.saveQuestion(newQuestion);

        await Promise.all(
            answers.map(async (item) => {
                const answer = new Answer();
                answer.detail = item.detail;
                answer.isCorrect = item.isCorrect;
                answer.question = newQuestion;
                await this.answerService.saveAnswer(answer);
            }),
        );

        return res.send(newQuestion);
    }

    @Put('/:id')
    @UseGuards(ExpertGuard)
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    @UseInterceptors(FileInterceptor('image'))
    @UsePipes(new JoiValidatorPipe(vUpdateQuestionDTO))
    async cUpdateQuestion(@Param('id') id: string, @Res() res: Response, @Body() body: UpdateQuestionDTO, @UploadedFile() file: Express.Multer.File) {
        const question = await this.questionService.getQuestionByField('id', id);

        const answers = body.answers ? (JSON.parse(body.answers) as Answer[]) : question.answers;
        body.isMultipleChoice = body.isMultipleChoice || question.isMultipleChoice;

        const countCorrect = answers.reduce((total, item) => {
            if (item.isCorrect) return total + 1;
            return total;
        }, 0);

        if (countCorrect <= 0) throw new HttpException({ errorMessage: ResponseMessage.QUESTION_ANSWER_CORRECT_ERROR }, StatusCodes.BAD_REQUEST);
        if (countCorrect > 1 && !body.isMultipleChoice) throw new HttpException({ errorMessage: ResponseMessage.SINGLE_CHOICE_ERROR }, StatusCodes.BAD_REQUEST);
        if (countCorrect <= 1 && body.isMultipleChoice) throw new HttpException({ errorMessage: ResponseMessage.MULTIPLE_CHOICE_ERROR }, StatusCodes.BAD_REQUEST);

        let newQuestion = new Question();
        const questionLevel = await this.questionLevelService.getOneByField('id', body.questionLevel);

        newQuestion.questionLevel = questionLevel || question.questionLevel;
        newQuestion.content = body.content || question.content;
        newQuestion.audioLink = body.audioLink || question.audioLink;
        newQuestion.videoLink = body.videoLink || question.videoLink;
        newQuestion.isMultipleChoice = body.isMultipleChoice;
        newQuestion.explanation = body.explanation;
        newQuestion.isActive = body.isActive === null || body.isActive === undefined ? newQuestion.isActive : body.isActive;
        newQuestion.dimensions = question.dimensions;
        newQuestion.lesson = question.lesson;

        if (file) {
            const result = await this.s3Service.uploadFile(file);
            if (result) newQuestion.imageUrl = result.Location;
            else throw new HttpException({ errorMessage: ResponseMessage.SOMETHING_WRONG }, StatusCodes.INTERNAL_SERVER_ERROR);
        } else newQuestion.imageUrl = question.imageUrl;

        newQuestion = await this.questionService.saveQuestion(newQuestion);
        await Promise.all(
            answers.map(async (item) => {
                const answer = new Answer();
                answer.detail = item.detail;
                answer.isCorrect = item.isCorrect;
                answer.question = newQuestion;
                await this.answerService.saveAnswer(answer);
            }),
        );

        question.isOld = true;
        await this.questionService.saveQuestion(question);
        const result = await this.quizDetailService.getQuizDetailsByQuestionId(question.id);
        const setQuizDetails = new Set<Quiz>();
        result.forEach((item) => setQuizDetails.add(item.quiz));
        const quizDetails = Array.from(setQuizDetails);

        Promise.all(
            quizDetails.map(async (item) => {
                let newQuiz = new Quiz();
                newQuiz.duration = item.duration;
                newQuiz.isPublic = item.isPublic;
                newQuiz.level = item.level;
                newQuiz.name = item.name;
                newQuiz.numberOfQuestion = item.numberOfQuestion;
                newQuiz.passRate = item.passRate;
                newQuiz.questions = item.questions;
                newQuiz.subject = item.subject;
                newQuiz.type = item.type;
                newQuiz = await this.quizService.saveQuiz(newQuiz);

                const result = await this.quizDetailService.getQuizDetailsByQuizId(item.id);
                Promise.all(
                    result.map(async (item) => {
                        if (!item.question.isOld) {
                            const question = item.question;
                            const quizDetail = new QuizDetail();
                            quizDetail.question = question;
                            quizDetail.quiz = newQuiz;
                            await this.quizDetailService.saveQuizDetail(quizDetail);
                        }
                    }),
                );
                const quizDetail = new QuizDetail();
                quizDetail.question = newQuestion;
                quizDetail.quiz = newQuiz;
                await this.quizDetailService.saveQuizDetail(quizDetail);
                item.isOld = true;
                await this.quizService.saveQuiz(item);
            }),
        );

        return res.send(newQuestion);
    }
}
