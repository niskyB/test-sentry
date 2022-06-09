import { LessonService } from './../lesson/lesson.service';
import { ExpertGuard } from './../auth/guard';
import { DimensionService } from './../dimension/dimension.service';
import { S3Service } from '../core/providers/s3/s3.service';
import { Question } from './../core/models';
import { JoiValidatorPipe } from './../core/pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { QuestionService } from './question.service';
import { Body, Controller, Get, HttpException, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ResponseMessage } from '../core/interface';
import { StatusCodes } from 'http-status-codes';
import { CreateQuestionDTO, vCreateQuestionDTO } from './dto';

@ApiTags('question')
@ApiBearerAuth()
@Controller('question')
export class QuestionController {
    constructor(
        private readonly questionService: QuestionService,
        private readonly s3Service: S3Service,
        private readonly dimensionService: DimensionService,
        private readonly lessonService: LessonService,
    ) {}

    @Get('/:id')
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
        const newQuestion = new Question();
        newQuestion.content = body.content;
        newQuestion.audioLink = body.audioLink;
        newQuestion.link = body.link;
        newQuestion.isMultipleChoice = body.isMultipleChoice;
        newQuestion.dimensions = [];

        if (file) {
            const result = await this.s3Service.uploadFile(file);
            if (result) newQuestion.imageUrl = result.Location;
            else throw new HttpException({ errorMessage: ResponseMessage.SOMETHING_WRONG }, StatusCodes.INTERNAL_SERVER_ERROR);
        }

        const dimensions = body.dimensions.split(',');
        for (const item of dimensions) {
            const dimension = await this.dimensionService.getDimensionByField('id', item);
            newQuestion.dimensions.push(dimension);
        }

        if (newQuestion.dimensions.length === 0) throw new HttpException({ dimensions: ResponseMessage.INVALID_DIMENSION }, StatusCodes.BAD_REQUEST);

        const lesson = await this.lessonService.getLessonByField('id', body.lesson);
        if (!lesson) throw new HttpException({ lesson: ResponseMessage.INVALID_LESSON }, StatusCodes.BAD_REQUEST);
        newQuestion.lesson = lesson;

        await this.questionService.saveQuestion(newQuestion);

        return res.send(newQuestion);
    }
}
