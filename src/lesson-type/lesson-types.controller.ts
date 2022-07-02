import { AdminGuard } from './../auth/guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Query, Res, UseGuards, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { LessonTypeService } from './lesson-type.service';
import { QueryJoiValidatorPipe } from '../core/pipe';
import { FilterSystemSettingsDTO, vFilterSystemSettingsDTO } from '../core/dto';

@ApiTags('lesson types')
@ApiBearerAuth()
@Controller('lesson-types')
export class LessonTypesController {
    constructor(private readonly lessonTypeService: LessonTypeService) {}

    @Get('')
    async cGetAllLessonTypes(@Res() res: Response) {
        const lessonTypes = await this.lessonTypeService.getAllLessonTypes();
        return res.send(lessonTypes);
    }

    @Get('/admin')
    @UseGuards(AdminGuard)
    @UsePipes(new QueryJoiValidatorPipe(vFilterSystemSettingsDTO))
    async cFilterLessonTypes(@Res() res: Response, @Query() queries: FilterSystemSettingsDTO) {
        const { value, status, order, orderBy, currentPage, pageSize } = queries;
        const result = await this.lessonTypeService.filterLessonTypes(status, value, order, orderBy, currentPage, pageSize);
        return res.send(result);
    }
}
