import { ExpertService } from './../expert/expert.service';
import { AuthService } from './../auth/auth.service';
import { User, UserRole, Marketing, Expert, Sale } from './../core/models';
import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from './../core/interface/message.enum';
import { UserService } from './../user/user.service';
import { vCreateUserDTO, CreateUserDTO, vFilterUsersDTO, FilterUsersDTO } from './dto';
import { JoiValidatorPipe, QueryJoiValidatorPipe } from './../core/pipe';
import { MarketingService } from './../marketing/marketing.service';
import { AdminGuard } from './../auth/guard';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Controller, UseGuards, Post, UsePipes, Body, Res, HttpException, Get, Query, Param, Put } from '@nestjs/common';
import { Response } from 'express';
import { constant } from '../core';
import { SaleService } from '../sale/sale.service';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
    constructor(
        private readonly marketingService: MarketingService,
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly saleService: SaleService,
        private readonly expertService: ExpertService,
    ) {}

    @Get('/users')
    @UsePipes(new QueryJoiValidatorPipe(vFilterUsersDTO))
    async cFilterUsers(@Res() res: Response, @Query() queries: FilterUsersDTO) {
        const { role, gender, isActive, currentPage, orderBy, order, pageSize, fullName, email, mobile } = queries;

        const users = await this.userService.filterUsers(role, gender, isActive, currentPage, pageSize, orderBy, order, fullName, email, mobile);

        return res.send(users);
    }

    @Get('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    async cGetOneById(@Param('id') id: string, @Res() res: Response) {
        const user = await this.userService.findUser('id', id);

        if (!user) throw new HttpException({ errorMessage: ResponseMessage.NOT_EXISTED_USER }, StatusCodes.NOT_FOUND);
        return res.send(user);
    }

    @Post('/user')
    @UsePipes(new JoiValidatorPipe(vCreateUserDTO))
    async cAddNewUser(@Body() body: CreateUserDTO, @Res() res: Response) {
        const user = await this.userService.findUser('email', body.email);
        if (user) throw new HttpException({ email: ResponseMessage.EMAIL_TAKEN }, StatusCodes.BAD_REQUEST);

        const newUser = new User();
        let newEmployee;
        if (body.role === UserRole.MARKETING) newEmployee = new Marketing();
        if (body.role === UserRole.EXPERT) newEmployee = new Expert();
        if (body.role === UserRole.SALE) newEmployee = new Sale();

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

        if (body.role === UserRole.EXPERT) {
            await this.expertService.saveExpert(newEmployee);
            newEmployee = await this.expertService.getExpertByUserId(newUser.id);
        }

        if (body.role === UserRole.SALE) {
            await this.saleService.saveSale(newEmployee);
            newEmployee = await this.saleService.getSaleByUserId(newUser.id);
        }

        newUser.typeId = newEmployee.id;
        await this.userService.saveUser(newUser);
        return res.send();
    }
}
