import { QueryJoiValidatorPipe } from './../core/pipe';
import { AdminGuard } from './../auth/guard';
import { Controller, Res, Get, UseGuards, Query, UsePipes } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { RoleService } from './role.service';
import { FilterSystemSettingsDTO, vFilterSystemSettingsDTO } from '../core/dto';

@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller('roles')
export class RolesController {
    constructor(private readonly roleService: RoleService) {}

    @Get('/admin')
    @UsePipes(new QueryJoiValidatorPipe(vFilterSystemSettingsDTO))
    async cFilterRoles(@Res() res: Response, @Query() queries: FilterSystemSettingsDTO) {
        const { value, status, order, orderBy, currentPage, pageSize } = queries;
        const result = await this.roleService.filterRoles(status, value, order, orderBy, currentPage, pageSize);
        return res.send(result);
    }
}
