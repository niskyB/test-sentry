import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { LessonTypeService } from './lesson-type.service';

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
}
