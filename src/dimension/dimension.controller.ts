import { UserService } from './../user/user.service';
import { SubjectService } from './../subject/subject.service';
import { Dimension, UserRole } from './../core/models';
import { ResponseMessage } from './../core/interface';
import { DimensionTypeService } from './../dimension-type/dimension-type.service';
import { JoiValidatorPipe } from './../core/pipe';
import { ExpertGuard } from './../auth/guard';
import { Controller, Post, UseGuards, UsePipes, Res, Body, HttpException, Get, Param, Put, Req } from '@nestjs/common';
import { DimensionService } from './dimension.service';
import { Response, Request } from 'express';
import { CreateDimensionDTO, UpdateDimensionDTO, vCreateDimensionDTO, vUpdateDimensionDTO } from './dto';
import { StatusCodes } from 'http-status-codes';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('dimension')
@ApiBearerAuth()
@Controller('dimension')
@UseGuards(ExpertGuard)
export class DimensionController {
    constructor(
        private readonly dimensionService: DimensionService,
        private readonly dimensionTypeService: DimensionTypeService,
        private readonly subjectService: SubjectService,
        private readonly userService: UserService,
    ) {}

    @Get('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    async cGetDimensionById(@Param('id') id: string, @Res() res: Response) {
        const dimension = await this.dimensionService.getDimensionByField('id', id);
        if (!dimension) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);

        dimension.subject.assignTo.user.password = '';
        dimension.subject.assignTo.user.token = '';
        return res.send(dimension);
    }

    @Post('')
    @UsePipes(new JoiValidatorPipe(vCreateDimensionDTO))
    async cCreateDimension(@Req() req: Request, @Res() res: Response, @Body() body: CreateDimensionDTO) {
        const user = await this.userService.findUser('id', req.user.id);
        const dimensionType = await this.dimensionTypeService.getDimensionTypeByField('id', body.type);
        if (!dimensionType) throw new HttpException({ category: ResponseMessage.INVALID_TYPE }, StatusCodes.BAD_REQUEST);

        const subject = await this.subjectService.getSubjectByField('id', body.subject);
        if (!subject) throw new HttpException({ category: ResponseMessage.INVALID_SUBJECT }, StatusCodes.BAD_REQUEST);
        if (user.role.name !== UserRole.ADMIN && subject.assignTo.id !== user.typeId) throw new HttpException({ errorMessage: ResponseMessage.FORBIDDEN }, StatusCodes.FORBIDDEN);

        const dimension = new Dimension();
        dimension.name = body.name;
        dimension.description = body.description;
        dimension.type = dimensionType;
        dimension.subject = subject;

        await this.dimensionService.saveDimension(dimension);
        dimension.subject.assignTo.user.password = '';
        dimension.subject.assignTo.user.token = '';
        return res.send(dimension);
    }

    @Put('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    @UsePipes(new JoiValidatorPipe(vUpdateDimensionDTO))
    async cUpdateDimension(@Param('id') id: string, @Res() res: Response, @Req() req: Request, @Body() body: UpdateDimensionDTO) {
        const user = await this.userService.findUser('id', req.user.id);
        const dimension = await this.dimensionService.getDimensionByField('id', id);

        if (!dimension) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);
        if (user.role.name !== UserRole.ADMIN && dimension.subject.assignTo.id !== user.typeId) throw new HttpException({ errorMessage: ResponseMessage.FORBIDDEN }, StatusCodes.FORBIDDEN);
        const type = await this.dimensionTypeService.getDimensionTypeByField('id', body.type);

        dimension.name = body.name || dimension.name;
        dimension.description = body.description || dimension.description;
        dimension.type = type || dimension.type;

        await this.dimensionService.saveDimension(dimension);

        dimension.subject.assignTo.user.password = '';
        dimension.subject.assignTo.user.token = '';

        return res.send(dimension);
    }
}
