import { SubjectTopicService } from './../subject-topic/subject-topic.service';
import { LessonQuizService } from './../lesson-quiz/lesson-quiz.service';
import { LessonDetailService } from './../lesson-detail/lesson-detail.service';
import { UserService } from './../user/user.service';
import { QuizService } from './../quiz/quiz.service';
import { Lesson, LessonDetail, LessonQuiz, LessonTypes, SubjectTopic, UserRole } from './../core/models';
import { SubjectService } from './../subject/subject.service';
import { LessonTypeService } from './../lesson-type/lesson-type.service';
import { CommonGuard, ExpertGuard } from './../auth/guard';
import { JoiValidatorPipe } from './../core/pipe';
import { ResponseMessage } from './../core/interface';
import { Body, Controller, Get, HttpException, Param, Post, Put, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { LessonService } from './lesson.service';
import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CreateLessonDTO, DeactivateLessonDTO, UpdateLessonDTO, vCreateLessonDTO, vDeactivateLessonDTO, vUpdateLessonDTO } from './dto';

@ApiTags('lesson')
@ApiBearerAuth()
@Controller('lesson')
export class LessonController {
    constructor(
        private readonly lessonService: LessonService,
        private readonly lessonTypeService: LessonTypeService,
        private readonly subjectService: SubjectService,
        private readonly quizService: QuizService,
        private readonly userService: UserService,
        private readonly lessonDetailService: LessonDetailService,
        private readonly lessonQuizService: LessonQuizService,
        private readonly subjectTopicService: SubjectTopicService,
    ) {}

    @Get('/:id')
    @UseGuards(CommonGuard)
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY', description: 'lesson id' })
    async cGetLessonById(@Param('id') id: string, @Res() res: Response) {
        const lesson = await this.lessonService.getLessonByField('id', id);

        if (!lesson) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);

        if (lesson.type.description == LessonTypes.LESSON) {
            const lessonDetail = await this.lessonDetailService.getLessonDetailByLessonId(lesson.id);
            lesson.lessonDetail = lessonDetail;
        }
        if (lesson.type.description == LessonTypes.QUIZ) {
            const lessonQuiz = await this.lessonQuizService.getLessonQuizByLessonId(lesson.id);
            lesson.lessonQuiz = lessonQuiz;
        }

        lesson.subject.assignTo.user.password = '';
        lesson.subject.assignTo.user.token = '';

        return res.send(lesson);
    }

    @Post('')
    @UseGuards(ExpertGuard)
    @UsePipes(new JoiValidatorPipe(vCreateLessonDTO))
    async cCreateLesson(@Req() req: Request, @Res() res: Response, @Body() body: CreateLessonDTO) {
        const lessonType = await this.lessonTypeService.getLessonTypeByField('id', body.type);
        if (!lessonType) throw new HttpException({ errorMessage: ResponseMessage.INVALID_TYPE }, StatusCodes.BAD_REQUEST);

        const subject = await this.subjectService.getSubjectByField('id', body.subject);
        if (!subject) throw new HttpException({ errorMessage: ResponseMessage.INVALID_SUBJECT }, StatusCodes.BAD_REQUEST);

        const user = await this.userService.findUser('id', req.user.id);
        if (user.role.description !== UserRole.ADMIN && subject.assignTo.id !== user.typeId) throw new HttpException({ errorMessage: ResponseMessage.FORBIDDEN }, StatusCodes.FORBIDDEN);

        const newLesson = new Lesson();
        const date = new Date();
        newLesson.name = body.name;
        newLesson.order = body.order;
        newLesson.topic = body.topic;
        newLesson.createdAt = date.toISOString();
        newLesson.updatedAt = date.toISOString();
        newLesson.subject = subject;
        newLesson.isActive = body.isActive === null || body.isActive === undefined ? newLesson.isActive : body.isActive;
        newLesson.type = lessonType;

        try {
            await this.lessonService.saveLesson(newLesson);
        } catch (err) {
            console.log(err);
        }

        if (lessonType.description === LessonTypes.TOPIC) {
            const subjectTopic = new SubjectTopic();
            subjectTopic.lesson = newLesson;

            try {
                await this.subjectTopicService.saveSubjectTopic(subjectTopic);
            } catch (error) {
                console.log(error);
                await this.lessonService.deleteLesson(newLesson);
                throw new HttpException({ errorMessage: ResponseMessage.SOMETHING_WRONG }, StatusCodes.INTERNAL_SERVER_ERROR);
            }
        }

        if (lessonType.description === LessonTypes.LESSON) {
            if (!body.htmlContent) throw new HttpException({ htmlContent: ResponseMessage.INVALID_HTML_CONTENT }, StatusCodes.BAD_REQUEST);
            if (!body.videoLink) throw new HttpException({ videoLink: ResponseMessage.INVALID_VIDEO_LINK }, StatusCodes.BAD_REQUEST);
            const lessonDetail = new LessonDetail();
            lessonDetail.htmlContent = body.htmlContent;
            lessonDetail.videoLink = body.videoLink;
            lessonDetail.lesson = newLesson;

            try {
                await this.lessonDetailService.saveLessonDetail(lessonDetail);
            } catch (error) {
                console.log(error);
                await this.lessonService.deleteLesson(newLesson);
                throw new HttpException({ errorMessage: ResponseMessage.SOMETHING_WRONG }, StatusCodes.INTERNAL_SERVER_ERROR);
            }
        }

        if (lessonType.description === LessonTypes.QUIZ) {
            if (!body.htmlContent) throw new HttpException({ htmlContent: ResponseMessage.INVALID_HTML_CONTENT }, StatusCodes.BAD_REQUEST);
            if (!body.quiz) throw new HttpException({ videoLink: ResponseMessage.INVALID_QUIZ }, StatusCodes.BAD_REQUEST);

            const quizzes = body.quiz.split(',');
            const lessonQuiz = new LessonQuiz();
            lessonQuiz.quizzes = [];
            await Promise.all(
                quizzes.map(async (item) => {
                    const result = await this.quizService.getQuizByField('id', item);
                    if (result) lessonQuiz.quizzes.push(result);
                }),
            );
            lessonQuiz.htmlContent = body.htmlContent;
            lessonQuiz.lesson = newLesson;

            try {
                await this.lessonQuizService.saveLessonQuiz(lessonQuiz);
            } catch (error) {
                console.log(error);
                await this.lessonService.deleteLesson(newLesson);
                throw new HttpException({ errorMessage: ResponseMessage.SOMETHING_WRONG }, StatusCodes.INTERNAL_SERVER_ERROR);
            }
        }

        newLesson.subject.assignTo.user.password = '';
        newLesson.subject.assignTo.user.token = '';

        return res.send(newLesson);
    }

    @Put('/activation/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY', description: 'lesson id' })
    @UseGuards(ExpertGuard)
    @UsePipes(new JoiValidatorPipe(vDeactivateLessonDTO))
    async cUpdateLessonStatus(@Param('id') id: string, @Req() req: Request, @Res() res: Response, @Body() body: DeactivateLessonDTO) {
        const user = await this.userService.findUser('id', req.user.id);
        const lesson = await this.lessonService.getLessonByField('id', id);

        if (!lesson) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);
        if (user.role.description !== UserRole.ADMIN && lesson.subject.assignTo.id !== user.typeId) throw new HttpException({ errorMessage: ResponseMessage.FORBIDDEN }, StatusCodes.FORBIDDEN);

        lesson.isActive = body.isActive === null || body.isActive === undefined ? lesson.isActive : body.isActive;
        lesson.updatedAt = new Date().toISOString();

        await this.lessonService.saveLesson(lesson);

        lesson.subject.assignTo.user.password = '';
        lesson.subject.assignTo.user.token = '';

        return res.send(lesson);
    }

    @Put('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY', description: 'lesson id' })
    @UseGuards(ExpertGuard)
    @UsePipes(new JoiValidatorPipe(vUpdateLessonDTO))
    async cUpdateLesson(@Param('id') id: string, @Req() req: Request, @Res() res: Response, @Body() body: UpdateLessonDTO) {
        const user = await this.userService.findUser('id', req.user.id);
        const lesson = await this.lessonService.getLessonByField('id', id);

        const type = await this.lessonTypeService.getLessonTypeByField('id', body.type);
        if (!type) throw new HttpException({ type: ResponseMessage.INVALID_TYPE }, StatusCodes.BAD_REQUEST);

        if (!lesson) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);
        if (user.role.description !== UserRole.ADMIN && lesson.subject.assignTo.id !== user.typeId) throw new HttpException({ errorMessage: ResponseMessage.FORBIDDEN }, StatusCodes.FORBIDDEN);

        lesson.name = body.name || lesson.name;
        lesson.order = body.order > 0 ? body.order : lesson.order;
        lesson.topic = body.topic || lesson.topic;

        if (type.description === LessonTypes.LESSON) {
            const lessonDetail = await this.lessonDetailService.getLessonDetailByLessonId(id);
            lessonDetail.htmlContent = body.htmlContent || lessonDetail.htmlContent;
            lessonDetail.videoLink = body.videoLink || lessonDetail.videoLink;

            await this.lessonDetailService.saveLessonDetail(lessonDetail);
        }

        if (type.description === LessonTypes.QUIZ) {
            const lessonQuiz = await this.lessonQuizService.getLessonQuizByLessonId(id);
            lessonQuiz.htmlContent = body.htmlContent || lessonQuiz.htmlContent;
            if (body.quiz) lessonQuiz.quizzes = [];

            const quiz = body.quiz.split(',');
            await Promise.all(
                quiz.map(async (item) => {
                    const result = await this.quizService.getQuizByField('id', item);
                    if (result) lessonQuiz.quizzes.push(result);
                }),
            );

            await this.lessonQuizService.saveLessonQuiz(lessonQuiz);
        }

        lesson.updatedAt = new Date().toISOString();
        await this.lessonService.saveLesson(lesson);

        lesson.subject.assignTo.user.password = '';
        lesson.subject.assignTo.user.token = '';

        return res.send(lesson);
    }
}
