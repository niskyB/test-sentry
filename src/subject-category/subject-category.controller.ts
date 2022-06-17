import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from './../core/interface';
import { AdminGuard } from './../auth/guard';
import { SubjectCategory } from './../core/models';
import { JoiValidatorPipe } from './../core/pipe';
import { Body, Controller, Post, Put, Res, UseGuards, UsePipes, Param, HttpException, Get } from '@nestjs/common';
import { Response } from 'express';
import { SubjectCategoryDTO, vSubjectCategoryDTO } from './dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { SubjectCategoryService } from './subject-category.service';

@ApiTags('subject-category')
@ApiBearerAuth()
@Controller('subject-category')
export class SubjectCategoryController {
    constructor(private readonly subjectCategoryService: SubjectCategoryService) {}

    @Get('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    async cGetSubjectCategoryById(@Res() res: Response, @Param('id') id: string) {
        const subjectCategory = await this.subjectCategoryService.getSubjectCategoryByField('id', id);

        if (!subjectCategory) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);

        return res.send(subjectCategory);
    }

    @Post('')
    @UseGuards(AdminGuard)
    @UsePipes(new JoiValidatorPipe(vSubjectCategoryDTO))
    async cCreateSubjectCategory(@Res() res: Response, @Body() body: SubjectCategoryDTO) {
        const subjectCategory = new SubjectCategory();
        subjectCategory.description = body.name;

        try {
            await this.subjectCategoryService.saveSubjectCategory(subjectCategory);
        } catch (err) {
            throw new HttpException({ errorMessage: ResponseMessage.DUPLICATED_CATEGORY }, StatusCodes.BAD_REQUEST);
        }

        return res.send(subjectCategory);
    }

    @Put('/:id')
    @UseGuards(AdminGuard)
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    @UsePipes(new JoiValidatorPipe(vSubjectCategoryDTO))
    async cUpdateSubjectCategory(@Res() res: Response, @Body() body: SubjectCategoryDTO, @Param('id') id: string) {
        const subjectCategory = await this.subjectCategoryService.getSubjectCategoryByField('id', id);
        subjectCategory.description = body.name;

        try {
            await this.subjectCategoryService.saveSubjectCategory(subjectCategory);
        } catch (err) {
            throw new HttpException({ errorMessage: ResponseMessage.DUPLICATED_CATEGORY }, StatusCodes.BAD_REQUEST);
        }

        return res.send(subjectCategory);
    }
}
