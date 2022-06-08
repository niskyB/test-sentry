import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { DimensionTypeService } from './dimension-type.service';

@ApiTags('dimension types')
@ApiBearerAuth()
@Controller('dimension-types')
export class DimensionTypesController {
    constructor(private readonly dimensionTypeService: DimensionTypeService) {}

    @Get('')
    async cGetAllDimensionTypes(@Res() res: Response) {
        const dimensionTypes = await this.dimensionTypeService.getAllDimensionTypes();
        return res.send(dimensionTypes);
    }
}
