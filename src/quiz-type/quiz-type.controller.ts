import { ResponseMessage } from './../core/interface';
import { UpdateSystemSettingStatusDTO, vUpdateSystemSettingStatusDTO } from './../core/dto';
import { JoiValidatorPipe } from './../core/pipe';
import { AdminGuard } from './../auth/guard';
import { Controller, Res, Get, Param, UseGuards, Put, UsePipes, Body, HttpException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { QuizTypeService } from './quiz-type.service';

@ApiTags('quiz-type')
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller('quiz-type')
export class QuizTypeController {
    constructor(private readonly quizTypeService: QuizTypeService) {}

    @Get('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    async cGetQuizTypeById(@Res() res: Response, @Param('id') id: string) {
        const quizType = await this.quizTypeService.getQuizTypeByField('id', id);
        return res.send(quizType);
    }

    @Put('/isActive/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    @UsePipes(new JoiValidatorPipe(vUpdateSystemSettingStatusDTO))
    async cUpdateQuizTypeStatus(@Res() res: Response, @Body() body: UpdateSystemSettingStatusDTO, @Param('id') id: string) {
        const quizType = await this.quizTypeService.getQuizTypeByField('id', id);
        quizType.isActive = body.isActive === null || body.isActive === undefined ? quizType.isActive : body.isActive;

        try {
            await this.quizTypeService.saveQuizType(quizType);
        } catch (err) {
            throw new HttpException({ errorMessage: ResponseMessage.DUPLICATED_CATEGORY }, StatusCodes.BAD_REQUEST);
        }

        return res.send(quizType);
    }
}
