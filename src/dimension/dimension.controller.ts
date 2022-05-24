import { Dimension } from './../core/models';
import { ResponseMessage } from './../core/interface';
import { DimensionTypeService } from './../dimension-type/dimension-type.service';
import { JoiValidatorPipe } from './../core/pipe';
import { ExpertGuard } from './../auth/guard';
import { Controller, Post, UseGuards, UsePipes, Res, Body, HttpException } from '@nestjs/common';
import { DimensionService } from './dimension.service';
import { Response } from 'express';
import { CreateDimensionDTO, vCreateDimensionDTO } from './dto';
import { StatusCodes } from 'http-status-codes';

@Controller('dimension')
@UseGuards(ExpertGuard)
export class DimensionController {
    constructor(private readonly dimensionService: DimensionService, private readonly dimensionTypeService: DimensionTypeService) {}

    @Post('')
    @UsePipes(new JoiValidatorPipe(vCreateDimensionDTO))
    async cCreateDimension(@Res() res: Response, @Body() body: CreateDimensionDTO) {
        const dimensionType = await this.dimensionTypeService.getDimensionTypeByField('name', body.type);
        if (!dimensionType) throw new HttpException({ category: ResponseMessage.INVALID_TYPE }, StatusCodes.BAD_REQUEST);

        const dimension = new Dimension();
        dimension.name = body.name;
        dimension.description = body.description;
        dimension.type = dimensionType;

        await this.dimensionService.saveDimension(dimension);

        return res.send(dimension);
    }
}
