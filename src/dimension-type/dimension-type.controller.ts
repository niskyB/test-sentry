import { ResponseMessage } from './../core/interface';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Controller, Get, HttpException, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { DimensionTypeService } from './dimension-type.service';
import { StatusCodes } from 'http-status-codes';

@ApiTags('dimension type')
@ApiBearerAuth()
@Controller('dimension-type')
export class DimensionTypeController {
    constructor(private readonly dimensionTypeService: DimensionTypeService) {}

    @Get('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    async cGetDimensionTypeById(@Res() res: Response, @Param('id') id: string) {
        const dimensionType = await this.dimensionTypeService.getDimensionTypeByField('id', id);

        if (!dimensionType) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);

        return res.send(dimensionType);
    }
}
