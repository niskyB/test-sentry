import { SubjectService } from './../subject/subject.service';
import { Dimension } from './../core/models';
import { ResponseMessage } from './../core/interface';
import { DimensionTypeService } from './../dimension-type/dimension-type.service';
import { JoiValidatorPipe } from './../core/pipe';
import { ExpertGuard } from './../auth/guard';
import { Controller, Post, UseGuards, UsePipes, Res, Body, HttpException, Get, Param, Put } from '@nestjs/common';
import { DimensionService } from './dimension.service';
import { Response } from 'express';
import { CreateDimensionDTO, UpdateDimensionDTO, vCreateDimensionDTO, vUpdateDimensionDTO } from './dto';
import { StatusCodes } from 'http-status-codes';

@Controller('dimension')
@UseGuards(ExpertGuard)
export class DimensionController {
    constructor(private readonly dimensionService: DimensionService, private readonly dimensionTypeService: DimensionTypeService, private readonly subjectService: SubjectService) {}

    @Get('/:id')
    async cGetSlider(@Param('id') id: string, @Res() res: Response) {
        const dimension = await this.dimensionService.getDimensionByField('id', id);
        if (!dimension) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);
        return res.send(dimension);
    }

    @Post('')
    @UsePipes(new JoiValidatorPipe(vCreateDimensionDTO))
    async cCreateDimension(@Res() res: Response, @Body() body: CreateDimensionDTO) {
        const dimensionType = await this.dimensionTypeService.getDimensionTypeByField('name', body.type);
        if (!dimensionType) throw new HttpException({ category: ResponseMessage.INVALID_TYPE }, StatusCodes.BAD_REQUEST);

        const subject = await this.subjectService.getSubjectByField('id', body.subject);
        if (!subject) throw new HttpException({ category: ResponseMessage.INVALID_SUBJECT }, StatusCodes.BAD_REQUEST);

        const dimension = new Dimension();
        dimension.name = body.name;
        dimension.description = body.description;
        dimension.type = dimensionType;
        dimension.subject = subject;

        await this.dimensionService.saveDimension(dimension);

        return res.send(dimension);
    }

    @Put('/:id')
    @UsePipes(new JoiValidatorPipe(vUpdateDimensionDTO))
    async cUpdateSlider(@Param('id') id: string, @Res() res: Response, @Body() body: UpdateDimensionDTO) {
        const dimension = await this.dimensionService.getDimensionByField('id', id);

        if (!dimension) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);

        const type = await this.dimensionTypeService.getDimensionTypeByField('id', body.type);

        dimension.name = body.name || dimension.name;
        dimension.description = body.description || dimension.description;
        dimension.type = type || dimension.type;

        await this.dimensionService.saveDimension(dimension);

        return res.send(dimension);
    }
}
