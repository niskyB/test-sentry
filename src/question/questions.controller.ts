import { QueryJoiValidatorPipe } from './../core/pipe';
import { ExpertGuard } from './../auth/guard';
import { UserRole } from './../core/models';
import { QuestionService } from './question.service';
import { Controller, Get, Query, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { FilterQuestionDTO, vFilterQuestionDTO } from './dto';

@ApiTags('questions')
@ApiBearerAuth()
@Controller('questions')
export class QuestionsController {
    constructor(private readonly questionService: QuestionService) {}

    @Get('/')
    @UseGuards(ExpertGuard)
    @UsePipes(new QueryJoiValidatorPipe(vFilterQuestionDTO))
    async cGetQuestionBySubjectId(@Query() queries: FilterQuestionDTO, @Res() res: Response, @Req() req: Request) {
        const { content, subject, lesson, level, currentPage, pageSize, dimension, isActive } = queries;
        let result;
        if (req.user && req.user.role.description === UserRole.ADMIN) {
            result = await this.questionService.getQuestionsForAdmin(subject, lesson, dimension, level, content, isActive, currentPage, pageSize);
        } else result = await this.questionService.getQuestionsByUserId(req.user.id, subject, lesson, dimension, level, content, isActive, currentPage, pageSize);

        return res.send(result);
    }
}
