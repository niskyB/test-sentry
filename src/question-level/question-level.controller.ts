import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from '../core/interface';
import { Controller, Res, Get, Param, HttpException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Response } from 'express';
import { QuestionLevelService } from './question-level.service';

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
}
