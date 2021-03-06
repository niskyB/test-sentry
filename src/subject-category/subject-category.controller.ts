import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from './../core/interface';
import { AdminGuard } from './../auth/guard';
import { SubjectCategory } from './../core/models';
import { JoiValidatorPipe } from './../core/pipe';
import { Body, Controller, Post, Put, Res, UseGuards, UsePipes, Param, HttpException, Get } from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { SubjectCategoryService } from './subject-category.service';
import { CreateSystemSettingDTO, UpdateSystemSettingDTO, UpdateSystemSettingStatusDTO, vCreateSystemSettingDTO, vUpdateSystemSettingDTO, vUpdateSystemSettingStatusDTO } from '../core/dto';

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
    @UsePipes(new JoiValidatorPipe(vCreateSystemSettingDTO))
    async cCreateSubjectCategory(@Res() res: Response, @Body() body: CreateSystemSettingDTO) {
        const subjectCategory = new SubjectCategory();
        subjectCategory.description = body.name;

        const lastCategory = await this.subjectCategoryService.getLastSubjectCategory();
        if (!lastCategory) subjectCategory.order = 1;
        else subjectCategory.order = lastCategory.order + 1;

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
    @UsePipes(new JoiValidatorPipe(vUpdateSystemSettingDTO))
    async cUpdateSubjectCategory(@Res() res: Response, @Body() body: UpdateSystemSettingDTO, @Param('id') id: string) {
        const subjectCategory = await this.subjectCategoryService.getSubjectCategoryByField('id', id);
        subjectCategory.description = body.name;

        if (subjectCategory.order !== body.order && body.order) {
            const existedOrder = await this.subjectCategoryService.getSubjectCategoryByField('order', body.order);
            if (existedOrder) throw new HttpException({ order: ResponseMessage.DUPLICATED_ORDER }, StatusCodes.BAD_REQUEST);
        }

        subjectCategory.order = body.order;

        try {
            await this.subjectCategoryService.saveSubjectCategory(subjectCategory);
        } catch (err) {
            throw new HttpException({ errorMessage: ResponseMessage.DUPLICATED_CATEGORY }, StatusCodes.BAD_REQUEST);
        }

        return res.send(subjectCategory);
    }

    @UseGuards(AdminGuard)
    @Put('/isActive/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    @UsePipes(new JoiValidatorPipe(vUpdateSystemSettingStatusDTO))
    async cUpdateSubjectCategoryStatus(@Res() res: Response, @Body() body: UpdateSystemSettingStatusDTO, @Param('id') id: string) {
        const subjectCategory = await this.subjectCategoryService.getSubjectCategoryByField('id', id);
        subjectCategory.isActive = body.isActive === null || body.isActive === undefined ? subjectCategory.isActive : body.isActive;

        try {
            await this.subjectCategoryService.saveSubjectCategory(subjectCategory);
        } catch (err) {
            throw new HttpException({ errorMessage: ResponseMessage.DUPLICATED_CATEGORY }, StatusCodes.BAD_REQUEST);
        }

        return res.send(subjectCategory);
    }
}
