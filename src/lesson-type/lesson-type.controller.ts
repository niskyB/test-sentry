import { ResponseMessage } from './../core/interface';
import { UpdateSystemSettingStatusDTO, vUpdateSystemSettingStatusDTO } from './../core/dto';
import { JoiValidatorPipe } from './../core/pipe';
import { AdminGuard } from './../auth/guard';
import { Controller, Res, Get, Param, UseGuards, Put, UsePipes, Body, HttpException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { LessonTypeService } from './lesson-type.service';

@ApiTags('lesson-type')
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller('lesson-type')
export class LessonTypeController {
    constructor(private readonly lessonTypeService: LessonTypeService) {}

    @Get('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    async cGetLessonTypeById(@Res() res: Response, @Param('id') id: string) {
        const lessonType = await this.lessonTypeService.getLessonTypeByField('id', id);
        return res.send(lessonType);
    }

    @Put('/isActive/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    @UsePipes(new JoiValidatorPipe(vUpdateSystemSettingStatusDTO))
    async cUpdateLessonTypeStatus(@Res() res: Response, @Body() body: UpdateSystemSettingStatusDTO, @Param('id') id: string) {
        const lessonType = await this.lessonTypeService.getLessonTypeByField('id', id);
        lessonType.isActive = body.isActive === null || body.isActive === undefined ? lessonType.isActive : body.isActive;

        try {
            await this.lessonTypeService.saveLessonType(lessonType);
        } catch (err) {
            throw new HttpException({ errorMessage: ResponseMessage.DUPLICATED_CATEGORY }, StatusCodes.BAD_REQUEST);
        }

        return res.send(lessonType);
    }
}
