import { AdminGuard } from './../auth/guard';
import { JoiValidatorPipe } from './../core/pipe';
import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from '../core/interface';
import { Controller, Res, Get, Param, HttpException, Put, UsePipes, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Response } from 'express';
import { QuestionLevelService } from './question-level.service';
import { UpdateSystemSettingStatusDTO, vUpdateSystemSettingStatusDTO } from '../core/dto';

@ApiTags('question level')
@ApiBearerAuth()
@Controller('question-level')
export class QuestionLevelController {
    constructor(private readonly questionLevelService: QuestionLevelService) {}

    @Get('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    async cGetQuestionLevelById(@Param('id') id: string, @Res() res: Response) {
        const questionLevel = await this.questionLevelService.getOneByField('id', id);

        if (!questionLevel) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);
        return res.send(questionLevel);
    }

    @Put('/isActive/:id')
    @UseGuards(AdminGuard)
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    @UsePipes(new JoiValidatorPipe(vUpdateSystemSettingStatusDTO))
    async cUpdateQuestionLevelStatus(@Res() res: Response, @Body() body: UpdateSystemSettingStatusDTO, @Param('id') id: string) {
        const questionLevel = await this.questionLevelService.getOneByField('id', id);
        questionLevel.isActive = body.isActive === null || body.isActive === undefined ? questionLevel.isActive : body.isActive;

        try {
            await this.questionLevelService.saveQuestionLevel(questionLevel);
        } catch (err) {
            throw new HttpException({ errorMessage: ResponseMessage.DUPLICATED_CATEGORY }, StatusCodes.BAD_REQUEST);
        }

        return res.send(questionLevel);
    }
}
