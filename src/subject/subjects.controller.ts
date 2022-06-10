import { QueryJoiValidatorPipe } from './../core/pipe';
import { FilterSubjectsDTO, vFilterSubjectsDTO } from './dto';
import { Controller, Res, UsePipes, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { SubjectService } from './subject.service';

@ApiTags('subjects')
@ApiBearerAuth()
@Controller('subjects')
export class SubjectsController {
    constructor(private readonly subjectService: SubjectService) {}

    @Get('')
    @UsePipes(new QueryJoiValidatorPipe(vFilterSubjectsDTO))
    async cFilterSubjects(@Res() res: Response, @Query() queries: FilterSubjectsDTO) {
        const { name, isActive, isFeature, category, currentPage, createdAt, pageSize, assignTo } = queries;

        const result = await this.subjectService.filterSubjects(name, createdAt, currentPage, pageSize, isActive, isFeature, category, assignTo);
        return res.send(result);
    }
}
