import { ResponseMessage } from './../core/interface';
import { UpdateSystemSettingStatusDTO, vUpdateSystemSettingStatusDTO } from './../core/dto';
import { JoiValidatorPipe } from './../core/pipe';
import { AdminGuard } from './../auth/guard';
import { Controller, Res, Get, Param, UseGuards, Put, UsePipes, Body, HttpException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Response } from 'express';
import { RoleService } from './role.service';
import { StatusCodes } from 'http-status-codes';

@ApiTags('role')
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Get('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    async cGetRoleById(@Res() res: Response, @Param('id') id: string) {
        const role = await this.roleService.getRoleByField('id', id);
        return res.send(role);
    }

    @Put('/isActive/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    @UsePipes(new JoiValidatorPipe(vUpdateSystemSettingStatusDTO))
    async cUpdateRoleStatus(@Res() res: Response, @Body() body: UpdateSystemSettingStatusDTO, @Param('id') id: string) {
        const role = await this.roleService.getRoleByField('id', id);
        role.isActive = body.isActive === null || body.isActive === undefined ? role.isActive : body.isActive;

        try {
            await this.roleService.saveRole(role);
        } catch (err) {
            throw new HttpException({ errorMessage: ResponseMessage.DUPLICATED_CATEGORY }, StatusCodes.BAD_REQUEST);
        }

        return res.send(role);
    }
}
