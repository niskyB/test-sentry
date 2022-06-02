import { Controller, Res, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { SubjectCategoryService } from './subject-category.service';

@ApiTags('subject categories')
@ApiBearerAuth()
@Controller('subject-categories')
export class SubjectCategoriesController {
    constructor(private readonly subjectCategoryService: SubjectCategoryService) {}

    @Get('')
    async cFilterSubjectCategories(@Res() res: Response) {
        const result = await this.subjectCategoryService.getAllSubjectCategories();
        return res.send(result);
    }
}
