import { UserService } from './../user/user.service';
import { QuizService } from './../quiz/quiz.service';
import { LessonQuizService } from './../lesson-quiz/lesson-quiz.service';
import { LessonDetailService } from './../lesson-detail/lesson-detail.service';
import { SubjectTopicService } from './../subject-topic/subject-topic.service';
import { Lesson, LessonDetail, LessonQuiz, SubjectTopic, UserRole } from './../core/models';
import { SubjectService } from './../subject/subject.service';
import { LessonTypeService } from './../lesson-type/lesson-type.service';
import { ExpertGuard } from './../auth/guard';
import { JoiValidatorPipe } from './../core/pipe';
import { ResponseMessage } from './../core/interface';
import { Body, Controller, Get, HttpException, Param, Post, Put, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { LessonService } from './lesson.service';
import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CreateLessonDTO, deactivateLessonDTO, vCreateLessonDTO, vDeactivateLessonDTO } from './dto';

@ApiTags('lesson')
@ApiBearerAuth()
@Controller('lesson')
export class LessonController {
    constructor(
        private readonly lessonService: LessonService,
        private readonly lessonTypeService: LessonTypeService,
        private readonly subjectService: SubjectService,
        private readonly subjectTopicService: SubjectTopicService,
        private readonly lessonDetailService: LessonDetailService,
        private readonly lessonQuizService: LessonQuizService,
        private readonly quizService: QuizService,
        private readonly userService: UserService,
    ) {}

    @Get('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY', description: 'lesson id' })
    async cGetLessonById(@Param('id') id: string, @Res() res: Response) {
        const lesson = await this.lessonService.getLessonByField('id', id);

        if (!lesson) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);

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
        if (user.role.name !== UserRole.ADMIN && subject.assignTo.id !== user.typeId) throw new HttpException({ errorMessage: ResponseMessage.FORBIDDEN }, StatusCodes.FORBIDDEN);

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

        await this.lessonService.saveLesson(newLesson);

        if (lessonType.name === 'Subject Topic') {
            const subjectTopic = new SubjectTopic();
            subjectTopic.lesson = newLesson;
            try {
                await this.subjectTopicService.saveSubjectTopic(subjectTopic);
            } catch (err) {
                console.log(err);
                await this.lessonService.deleteLesson(newLesson);
            }
        }

        if (lessonType.name === 'Lesson Detail') {
            if (!body.htmlContent) throw new HttpException({ htmlContent: ResponseMessage.INVALID_HTML_CONTENT }, StatusCodes.BAD_REQUEST);
            if (!body.videoLink) throw new HttpException({ videoLink: ResponseMessage.INVALID_VIDEO_LINK }, StatusCodes.BAD_REQUEST);
            const lessonDetail = new LessonDetail();
            lessonDetail.htmlContent = body.htmlContent;
            lessonDetail.videoLink = body.videoLink;
            lessonDetail.lesson = newLesson;
            try {
                await this.lessonDetailService.saveLessonDetail(lessonDetail);
            } catch (err) {
                console.log(err);
                await this.lessonService.deleteLesson(newLesson);
            }
        }

        if (lessonType.name === 'Lesson Quiz') {
            if (!body.htmlContent) throw new HttpException({ htmlContent: ResponseMessage.INVALID_HTML_CONTENT }, StatusCodes.BAD_REQUEST);
            if (!body.quiz) throw new HttpException({ videoLink: ResponseMessage.INVALID_QUIZ }, StatusCodes.BAD_REQUEST);

            const quiz = body.quiz.split(',');

            const lessonQuiz = new LessonQuiz();
            lessonQuiz.quizs = [];
            for (const item of quiz) {
                const res = await this.quizService.getQuizByField('id', item);
                lessonQuiz.quizs.push(res);
            }
            lessonQuiz.htmlContent = body.htmlContent;
            lessonQuiz.lesson = newLesson;

            try {
                await this.lessonQuizService.saveLessonQuiz(lessonQuiz);
            } catch (err) {
                console.log(err);
                await this.lessonService.deleteLesson(newLesson);
            }
        }

        return res.send(newLesson);
    }

    @Put('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY', description: 'lesson id' })
    @UseGuards(ExpertGuard)
    @UsePipes(new JoiValidatorPipe(vDeactivateLessonDTO))
    async cDeactivateLesson(@Param('id') id: string, @Req() req: Request, @Res() res: Response, @Body() body: deactivateLessonDTO) {
        const user = await this.userService.findUser('id', req.user.id);
        const lesson = await this.lessonService.getLessonByField('id', id);

        if (!lesson) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);
        if (user.role.name !== UserRole.ADMIN && lesson.subject.assignTo.id !== user.typeId) throw new HttpException({ errorMessage: ResponseMessage.FORBIDDEN }, StatusCodes.FORBIDDEN);

        lesson.isActive = body.isActive === null || body.isActive === undefined ? lesson.isActive : body.isActive;
        lesson.updatedAt = new Date().toISOString();

        await this.lessonService.saveLesson(lesson);

        return res.send(lesson);
    }
}
