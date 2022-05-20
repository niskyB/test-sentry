import { AuthService } from './../auth/auth.service';
import { User, UserRole, Marketing } from './../core/models';
import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from './../core/interface/message.enum';
import { UserService } from './../user/user.service';
import { vCreateUserDTO, CreateUserDTO } from './dto';
import { JoiValidatorPipe } from './../core/pipe/validator.pipe';
import { MarketingService } from './../marketing/marketing.service';
import { AdminGuard } from './../auth/guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, UseGuards, Post, UsePipes, Body, Res, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { constant } from '../core';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
    constructor(private readonly marketingService: MarketingService, private readonly userService: UserService, private readonly authService: AuthService) {}

    @Post('/user')
    @UsePipes(new JoiValidatorPipe(vCreateUserDTO))
    async cSendVerifyEmail(@Body() body: CreateUserDTO, @Res() res: Response) {
        const user = await this.userService.findUser('email', body.email);
        if (user) throw new HttpException({ email: ResponseMessage.EMAIL_TAKEN }, StatusCodes.BAD_REQUEST);

        const newUser = new User();
        let newEmployee;
        if (body.role === UserRole.MARKETING) newEmployee = new Marketing();

        newUser.fullName = body.fullName;
        newUser.email = body.email;
        newUser.password = await this.authService.encryptPassword(body.password, constant.default.hashingSalt);
        newUser.gender = body.gender;
        newUser.mobile = body.mobile;
        newUser.isActive = true;
        newEmployee.user = newUser;
        newUser.role = await this.userService.findRole('name', body.role);

        await this.userService.saveUser(newUser);
        if (body.role === UserRole.MARKETING) {
            await this.marketingService.saveMarketing(newEmployee);
            newEmployee = await this.marketingService.getMarketingByUserId(newUser.id);
        }

        newUser.typeId = newEmployee.id;
        await this.userService.saveUser(newUser);
        return res.send();
    }
}
