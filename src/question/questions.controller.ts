import { ExpertGuard } from './../auth/guard';
import { UserRole } from './../core/models';
import { QuestionService } from './question.service';
import { Controller, Get, HttpException, Param, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { ResponseMessage } from '../core/interface';
import { StatusCodes } from 'http-status-codes';

@ApiTags('questions')
@ApiBearerAuth()
@Controller('questions')
export class QuestionsController {
    constructor(private readonly questionService: QuestionService) {}

    @Get('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY', description: 'Subject Id' })
    async cGetQuestionBySubjectId(@Param('id') id: string, @Res() res: Response) {
        const questions = await this.questionService.getQuestionBySubjectId(id);

        if (!questions) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);

        return res.send(questions);
    }

    @Get('/')
    @UseGuards(ExpertGuard)
    async cGetQuestionsByUserId(@Res() res: Response, @Req() req: Request) {
        let result;
        if (req.user && req.user.role.name === UserRole.ADMIN) {
            result = await this.questionService.getAllQuestions();
        } else result = await this.questionService.getQuestionsByUserId(req.user.id);

        return res.send(result);
    }
}
