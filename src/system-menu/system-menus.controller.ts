import { QueryJoiValidatorPipe } from './../core/pipe';
import { AdminGuard } from './../auth/guard';
import { Controller, Res, Get, UseGuards, Query, UsePipes } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { FilterSystemSettingsDTO, vFilterSystemSettingsDTO } from '../core/dto';
import { SystemMenuService } from './system-menu.service';

@ApiTags('system-menus')
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller('system-menus')
export class SystemMenusController {
    constructor(private readonly systemMenuService: SystemMenuService) {}

    @Get('/admin')
    @UsePipes(new QueryJoiValidatorPipe(vFilterSystemSettingsDTO))
    async cFilterSystemMenus(@Res() res: Response, @Query() queries: FilterSystemSettingsDTO) {
        const { value, isActive: status, order, orderBy, currentPage, pageSize } = queries;
        const result = await this.systemMenuService.filterSystemMenus(status, value, order, orderBy, currentPage, pageSize);
        return res.send(result);
    }
}
