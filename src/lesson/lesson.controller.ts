import { ResponseMessage } from './../core/interface';
import { Controller, Get, HttpException, Param, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { LessonService } from './lesson.service';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

@ApiTags('lesson')
@ApiBearerAuth()
@Controller('lesson')
export class LessonController {
    constructor(private readonly lessonService: LessonService) {}

    @Get('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY', description: 'lesson id' })
    async cGetLessonById(@Param('id') id: string, @Res() res: Response) {
        const lesson = await this.lessonService.getLessonByField('id', id);

        if (!lesson) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);

        return res.send(lesson);
    }
}
