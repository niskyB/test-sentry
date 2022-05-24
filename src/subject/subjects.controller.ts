import { ExpertGuard } from './../auth/guard';
import { QueryJoiValidatorPipe } from './../core/pipe/queryValidator.pipe';
import { FilterSubjectsDTO, vFilterSubjectsDTO } from './dto';
import { Controller, Res, UseGuards, UsePipes, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { SubjectService } from './subject.service';

@ApiTags('subjects')
@ApiBearerAuth()
@UseGuards(ExpertGuard)
@Controller('subjects')
export class SlidersController {
    constructor(private readonly subjectService: SubjectService) {}

    @Get('')
    @UsePipes(new QueryJoiValidatorPipe(vFilterSubjectsDTO))
    async cFilterSliders(@Res() res: Response, @Query() queries: FilterSubjectsDTO) {
        const { name, isActive, category, currentPage, createdAt, pageSize } = queries;

        const result = await this.subjectService.filterSubjects(name, createdAt, currentPage, pageSize, isActive, category);
        return res.send(result);
    }
}
