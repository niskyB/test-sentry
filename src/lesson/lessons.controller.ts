import { ResponseMessage } from './../core/interface';
import { Controller, Get, HttpException, Param, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { LessonService } from './lesson.service';
import { StatusCodes } from 'http-status-codes';
import { Response } from 'express';

@ApiTags('lessons')
@ApiBearerAuth()
@Controller('lessons')
export class LessonsController {
    constructor(private readonly lessonService: LessonService) {}

    @Get('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY', description: 'subject id' })
    async cGetLessonsBySubjectId(@Param('id') id: string, @Res() res: Response) {
        let lessons = await this.lessonService.getLessonsBySubjectId(id);

        if (!lessons) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);

        lessons = lessons.map((item) => {
            item.subject.assignTo.user.password = '';
            item.subject.assignTo.user.token = '';
            return item;
        }, []);

        return res.send(lessons);
    }
}
