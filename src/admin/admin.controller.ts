import { CustomerService } from './../customer/customer.service';
import { EmailAction, ResponseMessage } from './../core/interface';
import { DataService } from './../core/providers';
import { ExpertService } from './../expert/expert.service';
import { AuthService } from './../auth/auth.service';
import { User, UserRole, Marketing, Expert, Sale, Admin, Customer } from './../core/models';
import { StatusCodes } from 'http-status-codes';
import { UserService } from './../user/user.service';
import { vCreateUserDTO, CreateUserDTO, vFilterUsersDTO, FilterUsersDTO, vUpdateUserStatusDTO, UpdateUserStatusDTO, UpdateUserRoleDTO, vUpdateUserRoleDTO } from './dto';
import { JoiValidatorPipe, QueryJoiValidatorPipe } from './../core/pipe';
import { MarketingService } from './../marketing/marketing.service';
import { AdminGuard } from './../auth/guard';
import { ApiTags, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Controller, UseGuards, Post, UsePipes, Body, Res, HttpException, Get, Query, Param, Put } from '@nestjs/common';
import { Response } from 'express';
import { constant } from '../core';
import { SaleService } from '../sale/sale.service';
import { AdminService } from './admin.service';

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
        private readonly dataService: DataService,
        private readonly adminService: AdminService,
        private readonly customerService: CustomerService,
    ) {}

    @Get('/users')
    @UsePipes(new QueryJoiValidatorPipe(vFilterUsersDTO))
    async cFilterUsers(@Res() res: Response, @Query() queries: FilterUsersDTO) {
        const { role, gender, isActive, currentPage, orderBy, order, pageSize, fullName, email, mobile } = queries;

        const users = await this.userService.filterUsers(role, gender, isActive, currentPage, pageSize, orderBy, order, fullName, email, mobile);

        users.data = users.data.map((item) => {
            item.password = '';
            item.token = '';
            return item;
        }, []);

        return res.send(users);
    }

    @Get('/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    async cGetOneById(@Param('id') id: string, @Res() res: Response) {
        const user = await this.userService.findUser('id', id);

        if (!user) throw new HttpException({ errorMessage: ResponseMessage.NOT_EXISTED_USER }, StatusCodes.NOT_FOUND);

        user.password = '';
        user.token = '';
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
        if (body.role === UserRole.CUSTOMER) newEmployee = new Customer();

        newUser.fullName = body.fullName;
        newUser.email = body.email;
        // const password = this.dataService.generateData(8, 'lettersAndNumbers');
        const password = '12345678';
        newUser.password = await this.authService.encryptPassword(password, constant.default.hashingSalt);
        const hashPassword = newUser.password;
        newUser.gender = body.gender;
        newUser.mobile = body.mobile;
        newUser.isActive = body.isActive;
        newEmployee.user = newUser;
        newUser.role = await this.userService.findRole('description', body.role);

        await this.userService.saveUser(newUser);
        switch (body.role) {
            case UserRole.MARKETING:
                await this.marketingService.saveMarketing(newEmployee);
                newEmployee = await this.marketingService.getMarketingByUserId(newUser.id);
                break;
            case UserRole.EXPERT:
                await this.expertService.saveExpert(newEmployee);
                newEmployee = await this.expertService.getExpertByUserId(newUser.id);
                break;
            case UserRole.SALE:
                await this.saleService.saveSale(newEmployee);
                newEmployee = await this.saleService.getSaleByUserId(newUser.id);
                break;
            case UserRole.CUSTOMER:
                await this.customerService.saveCustomer(newEmployee);
                newEmployee = await this.customerService.getCustomerByUserId(newUser.id);
                break;
        }

        newUser.typeId = newEmployee.id;
        await this.userService.saveUser(newUser);
        newUser.password = password;

        const isSend = await this.authService.sendEmailToken(newUser, EmailAction.SEND_PASSWORD, hashPassword);

        if (!isSend) {
            throw new HttpException({ errorMessage: ResponseMessage.SOMETHING_WRONG }, StatusCodes.INTERNAL_SERVER_ERROR);
        }
        return res.send();
    }

    @Put('/user/status/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    @UsePipes(new JoiValidatorPipe(vUpdateUserStatusDTO))
    async cUpdateUserStatus(@Param('id') id: string, @Res() res: Response, @Body() body: UpdateUserStatusDTO) {
        const user = await this.userService.findUser('id', id);

        if (!user) throw new HttpException({ errorMessage: ResponseMessage.NOT_EXISTED_USER }, StatusCodes.NOT_FOUND);

        user.isActive = body.isActive;
        user.updatedAt = new Date().toISOString();

        await this.userService.saveUser(user);

        user.password = '';
        user.token = '';
        return res.send(user);
    }

    @Put('/user/role/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    @UsePipes(new JoiValidatorPipe(vUpdateUserRoleDTO))
    async cUpdateUserRole(@Param('id') id: string, @Res() res: Response, @Body() body: UpdateUserRoleDTO) {
        const user = await this.userService.findUser('id', id);

        if (!user) throw new HttpException({ errorMessage: ResponseMessage.NOT_EXISTED_USER }, StatusCodes.NOT_FOUND);

        switch (body.role) {
            case UserRole.ADMIN:
                const existingAdmin = await this.adminService.getAdminByUserId(user.id);
                if (existingAdmin) user.typeId = existingAdmin.id;
                else {
                    const newAdmin = new Admin();
                    newAdmin.user = user;
                    const result = await this.adminService.saveAdmin(newAdmin);
                    user.typeId = result.id;
                }
                break;
            case UserRole.CUSTOMER:
                const existingCustomer = await this.customerService.getCustomerByUserId(user.id);
                if (existingCustomer) user.typeId = existingCustomer.id;
                else {
                    const newCustomer = new Customer();
                    newCustomer.user = user;
                    const result = await this.customerService.saveCustomer(newCustomer);
                    user.typeId = result.id;
                }
                break;
            case UserRole.EXPERT:
                const existingExpert = await this.expertService.getExpertByUserId(user.id);
                if (existingExpert) user.typeId = existingExpert.id;
                else {
                    const newExpert = new Expert();
                    newExpert.user = user;
                    const result = await this.expertService.saveExpert(newExpert);
                    user.typeId = result.id;
                }
                break;
            case UserRole.MARKETING:
                const existingMarketing = await this.marketingService.getMarketingByUserId(user.id);
                if (existingMarketing) user.typeId = existingMarketing.id;
                else {
                    const newMarketing = new Marketing();
                    newMarketing.user = user;
                    const result = await this.marketingService.saveMarketing(newMarketing);
                    user.typeId = result.id;
                }
                break;
            case UserRole.SALE:
                const existingSale = await this.saleService.getSaleByUserId(user.id);
                if (existingSale) user.typeId = existingSale.id;
                else {
                    const newSale = new Sale();
                    newSale.user = user;
                    const result = await this.saleService.saveSale(newSale);
                    user.typeId = result.id;
                }
                break;
        }

        user.role = await this.userService.findRole('description', body.role);
        user.updatedAt = new Date().toISOString();
        await this.userService.saveUser(user);

        user.password = '';
        user.token = '';
        return res.send(user);
    }
}
