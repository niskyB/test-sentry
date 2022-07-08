import { CommonGuard } from './../auth/guard';
import { QueryJoiValidatorPipe } from './../core/pipe';
import { ResponseMessage } from './../core/interface';
import { Controller, Get, HttpException, Param, Query, Res, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { LessonService } from './lesson.service';
import { StatusCodes } from 'http-status-codes';
import { Response } from 'express';
import { FilterLessonDTO, vFilterLessonDTO } from './dto';

@ApiTags('lessons')
@ApiBearerAuth()
@UseGuards(CommonGuard)
@Controller('lessons')
export class LessonsController {
    constructor(private readonly lessonService: LessonService) {}

    @Get('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY', description: 'Subject id' })
    @UsePipes(new QueryJoiValidatorPipe(vFilterLessonDTO))
    async cGetLessonsBySubjectId(@Param('id') id: string, @Res() res: Response, @Query() queries: FilterLessonDTO) {
        const { title, type, createdAt, updatedAt, isActive } = queries;
        const lessons = await this.lessonService.getLessonsBySubjectId(id, title, type, createdAt, updatedAt, isActive);

        if (!lessons) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);

        lessons.data = lessons.data.map((item) => {
            item.subject.assignTo.user.password = '';
            item.subject.assignTo.user.token = '';
            return item;
        }, []);

        return res.send(lessons);
    }
}
