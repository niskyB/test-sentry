import { AdminGuard } from './../auth/guard';
import { Controller, Res, Get, UseGuards, UsePipes, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { QuestionLevelService } from './question-level.service';
import { QueryJoiValidatorPipe } from '../core/pipe';
import { FilterSystemSettingsDTO, vFilterSystemSettingsDTO } from '../core/dto';

@ApiTags('question levels')
@ApiBearerAuth()
@Controller('question-levels')
export class QuestionLevelsController {
    constructor(private readonly questionLevelService: QuestionLevelService) {}

    @Get('')
    async cGetAllQuestionLevels(@Res() res: Response) {
        const questionLevels = await this.questionLevelService.getAllQuestionLevel();
        return res.send(questionLevels);
    }

    @Get('/admin')
    @UseGuards(AdminGuard)
    @UsePipes(new QueryJoiValidatorPipe(vFilterSystemSettingsDTO))
    async cFilterQuestionLevels(@Res() res: Response, @Query() queries: FilterSystemSettingsDTO) {
        const { value, status, order, orderBy, currentPage, pageSize } = queries;
        const result = await this.questionLevelService.filterQuestionLevels(status, value, order, orderBy, currentPage, pageSize);
        return res.send(result);
    }
}
