import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ExamLevelService } from './exam-level.service';

@ApiTags('exam levels')
@ApiBearerAuth()
@Controller('exam-levels')
export class ExamLevelsController {
    constructor(private readonly examLevelService: ExamLevelService) {}

    @Get('')
    async cGetAllExamLevels(@Res() res: Response) {
        const examLevels = await this.examLevelService.getAllExamLevel();
        return res.send(examLevels);
    }
}
