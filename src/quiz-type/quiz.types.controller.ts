import { QueryJoiValidatorPipe } from './../core/pipe';
import { AdminGuard } from './../auth/guard';
import { QuizTypeService } from './quiz-type.service';
import { Controller, Res, Get, UseGuards, UsePipes, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { FilterSystemSettingsDTO, vFilterSystemSettingsDTO } from '../core/dto';

@ApiTags('quiz types')
@ApiBearerAuth()
@Controller('quiz-types')
export class QuizTypesController {
    constructor(private readonly quizTypeService: QuizTypeService) {}

    @Get('')
    async cGetAllQuizTypes(@Res() res: Response) {
        const questionLevels = await this.quizTypeService.getAllQuizTypes();
        return res.send(questionLevels);
    }

    @Get('/admin')
    @UseGuards(AdminGuard)
    @UsePipes(new QueryJoiValidatorPipe(vFilterSystemSettingsDTO))
    async cFilterQuizTypes(@Res() res: Response, @Query() queries: FilterSystemSettingsDTO) {
        const { value, status, order, orderBy, currentPage, pageSize } = queries;
        const result = await this.quizTypeService.filterQuizTypes(status, value, order, orderBy, currentPage, pageSize);
        return res.send(result);
    }
}
