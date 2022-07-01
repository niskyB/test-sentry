import { Controller, Res, Get, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Response } from 'express';
import { RoleService } from './role.service';

@ApiTags('role')
@ApiBearerAuth()
@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Get('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    async cGetRoleById(@Res() res: Response, @Param('id') id: string) {
        const role = await this.roleService.getRoleByField('id', id);
        return res.send(role);
    }
}
