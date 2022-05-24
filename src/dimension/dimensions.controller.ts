import { QueryJoiValidatorPipe } from './../core/pipe/';
import { ExpertGuard } from './../auth/guard';
import { Controller, UseGuards, Res, Get, UsePipes, Body } from '@nestjs/common';
import { DimensionService } from './dimension.service';
import { Response } from 'express';
import { GetDimensionsDTO, vGetDimensionsDTO } from './dto';

@Controller('dimensions')
@UseGuards(ExpertGuard)
export class DimensionsController {
    constructor(private readonly dimensionService: DimensionService) {}

    @Get('')
    @UsePipes(new QueryJoiValidatorPipe(vGetDimensionsDTO))
    async cGetSlider(@Res() res: Response, @Body() body: GetDimensionsDTO) {
        const dimensions = await this.dimensionService.getDimensionsBySubjectId(body.id, body.currentPage, body.pageSize);
        return res.send(dimensions);
    }
}
