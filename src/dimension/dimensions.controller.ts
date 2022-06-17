import { QueryJoiValidatorPipe } from './../core/pipe/';
import { ExpertGuard } from './../auth/guard';
import { Controller, UseGuards, Res, Get, UsePipes, Query } from '@nestjs/common';
import { DimensionService } from './dimension.service';
import { Response } from 'express';
import { GetDimensionsDTO, vGetDimensionsDTO } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('dimensions')
@ApiBearerAuth()
@Controller('dimensions')
@UseGuards(ExpertGuard)
export class DimensionsController {
    constructor(private readonly dimensionService: DimensionService) {}

    @Get('')
    @UsePipes(new QueryJoiValidatorPipe(vGetDimensionsDTO))
    async cGetDimensionBySubjectId(@Res() res: Response, @Query() queries: GetDimensionsDTO) {
        const dimensions = await this.dimensionService.getDimensionsBySubjectId(queries.id, queries.currentPage, queries.pageSize);

        dimensions.data = dimensions.data.map((item) => {
            item.subject.assignTo.user.password = '';
            item.subject.assignTo.user.token = '';
            return item;
        }, []);
        return res.send(dimensions);
    }
}
