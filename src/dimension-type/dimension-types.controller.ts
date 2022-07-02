import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Query, Res, UseGuards, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { DimensionTypeService } from './dimension-type.service';
import { AdminGuard } from '../auth/guard';
import { QueryJoiValidatorPipe } from '../core/pipe';
import { FilterSystemSettingsDTO, vFilterSystemSettingsDTO } from '../core/dto';

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

    @Get('/admin')
    @UseGuards(AdminGuard)
    @UsePipes(new QueryJoiValidatorPipe(vFilterSystemSettingsDTO))
    async cFilterDimensionTypes(@Res() res: Response, @Query() queries: FilterSystemSettingsDTO) {
        const { value, status, order, orderBy, currentPage, pageSize } = queries;
        const result = await this.dimensionTypeService.filterDimensionTypes(status, value, order, orderBy, currentPage, pageSize);
        return res.send(result);
    }
}
