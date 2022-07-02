import { JoiValidatorPipe } from './../core/pipe';
import { AdminGuard } from './../auth/guard';
import { ResponseMessage } from './../core/interface';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Body, Controller, Get, HttpException, Param, Put, Res, UseGuards, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { DimensionTypeService } from './dimension-type.service';
import { StatusCodes } from 'http-status-codes';
import { UpdateSystemSettingStatusDTO, vUpdateSystemSettingStatusDTO } from '../core/dto';

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

    @Put('/isActive/:id')
    @UseGuards(AdminGuard)
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    @UsePipes(new JoiValidatorPipe(vUpdateSystemSettingStatusDTO))
    async cUpdateDimensionTypeStatus(@Res() res: Response, @Body() body: UpdateSystemSettingStatusDTO, @Param('id') id: string) {
        const dimensionType = await this.dimensionTypeService.getDimensionTypeByField('id', id);
        dimensionType.isActive = body.isActive === null || body.isActive === undefined ? dimensionType.isActive : body.isActive;

        try {
            await this.dimensionTypeService.saveDimensionType(dimensionType);
        } catch (err) {
            throw new HttpException({ errorMessage: ResponseMessage.DUPLICATED_CATEGORY }, StatusCodes.BAD_REQUEST);
        }

        return res.send(dimensionType);
    }
}
