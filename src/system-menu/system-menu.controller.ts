import { ResponseMessage } from './../core/interface';
import { UpdateSystemSettingStatusDTO, vUpdateSystemSettingStatusDTO } from './../core/dto';
import { JoiValidatorPipe } from './../core/pipe';
import { AdminGuard } from './../auth/guard';
import { Controller, Res, Get, Param, UseGuards, Put, UsePipes, Body, HttpException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SystemMenuService } from './system-menu.service';

@ApiTags('system-menu')
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller('system-menu')
export class SystemMenuController {
    constructor(private readonly systemMenuService: SystemMenuService) {}

    @Get('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    async cGetRoleById(@Res() res: Response, @Param('id') id: string) {
        const systemMenu = await this.systemMenuService.getSystemMenuByField('id', id);
        return res.send(systemMenu);
    }

    @Put('/isActive/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    @UsePipes(new JoiValidatorPipe(vUpdateSystemSettingStatusDTO))
    async cUpdateSystemMenuStatus(@Res() res: Response, @Body() body: UpdateSystemSettingStatusDTO, @Param('id') id: string) {
        const systemMenu = await this.systemMenuService.getSystemMenuByField('id', id);
        systemMenu.isActive = body.isActive === null || body.isActive === undefined ? systemMenu.isActive : body.isActive;

        try {
            await this.systemMenuService.saveSystemMenu(systemMenu);
        } catch (err) {
            throw new HttpException({ errorMessage: ResponseMessage.DUPLICATED_CATEGORY }, StatusCodes.BAD_REQUEST);
        }

        return res.send(systemMenu);
    }
}
