import { QueryJoiValidatorPipe } from './../core/pipe';
import { Controller, Res, Get, UseGuards, UsePipes, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { AdminGuard } from '../auth/guard';
import { SubjectCategoryService } from './subject-category.service';
import { FilterSystemSettingsDTO, vFilterSystemSettingsDTO } from '../core/dto';

@ApiTags('subject categories')
@ApiBearerAuth()
@Controller('subject-categories')
export class SubjectCategoriesController {
    constructor(private readonly subjectCategoryService: SubjectCategoryService) {}

    @Get('/admin')
    @UseGuards(AdminGuard)
    @UsePipes(new QueryJoiValidatorPipe(vFilterSystemSettingsDTO))
    async cFilterSubjectCategories(@Res() res: Response, @Query() queries: FilterSystemSettingsDTO) {
        const { value, isActive: status, currentPage, pageSize, order, orderBy } = queries;
        const result = await this.subjectCategoryService.filterSubjectCategories(status, value, order, orderBy, currentPage, pageSize);
        return res.send(result);
    }

    @Get('')
    async cGetAllSubjectCategories(@Res() res: Response) {
        const result = await this.subjectCategoryService.getAllSubjectCategories();
        return res.send(result);
    }
}
