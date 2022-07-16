import { DateService, DataService } from './../core/providers';
import { CommonGuard, RegistrationGuard, SaleGuard } from './../auth/guard';
import { EmailAction, ResponseMessage } from './../core/interface';
import { SaleService } from './../sale/sale.service';
import { CustomerService } from './../customer/customer.service';
import { Customer, RegistrationStatus, User, UserRole, Registration } from './../core/models';
import { Body, Controller, Get, HttpException, Param, Post, Put, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from '../auth/auth.service';
import { JoiValidatorPipe } from '../core/pipe';
import { PricePackageService } from '../price-package/price-package.service';
import { UserService } from '../user/user.service';
import {
    CreateRegistrationDTO,
    UpdateGeneralInformationDTO,
    UpdateRegistrationByUserDTO,
    UpdateSpecificInformationDTO,
    vCreateRegistrationDTO,
    vUpdateGeneralInformationDTO,
    vUpdateRegistrationByUserDTO,
    vUpdateSpecificInformationDTO,
} from './dto';
import { RegistrationService } from './registration.service';
import { constant } from '../core';
import { Cron, CronExpression } from '@nestjs/schedule';

@ApiTags('registration')
@Controller('registration')
@ApiBearerAuth()
export class RegistrationController {
    constructor(
        private readonly registrationService: RegistrationService,
        private readonly authService: AuthService,
        private readonly pricePackageService: PricePackageService,
        private readonly userService: UserService,
        private readonly customerService: CustomerService,
        private readonly dataService: DataService,
        private readonly saleService: SaleService,
        private readonly dateService: DateService,
    ) {}

    @Get('/:id')
    @UseGuards(CommonGuard)
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    async cGetRegistration(@Res() res: Response, @Param('id') id: string) {
        const registration = await this.registrationService.getRegistrationByField('id', id);
        if (!registration) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);
        return res.send(registration);
    }

    @Post('')
    @UseGuards(RegistrationGuard)
    @UsePipes(new JoiValidatorPipe(vCreateRegistrationDTO))
    async cCreateRegistration(@Req() req: Request, @Res() res: Response, @Body() body: CreateRegistrationDTO) {
        const pricePackage = await this.pricePackageService.getPricePackageByField('id', body.pricePackage);
        if (!pricePackage) throw new HttpException({ errorMessage: ResponseMessage.INVALID_TYPE }, StatusCodes.BAD_REQUEST);

        let user;
        if (req.user && req.user.role.description !== UserRole.ADMIN && req.user.role.description !== UserRole.SALE) {
            user = req.user;
        } else {
            user = await this.userService.findUser('email', body.email);
            if (!user) {
                user = new User();
                let customer = new Customer();
                user.fullName = body.fullName;
                user.email = body.email;
                user.gender = body.gender;
                user.password = '';
                user.mobile = body.mobile;
                user.role = await this.userService.findRole('description', UserRole.CUSTOMER);
                user.createdAt = new Date().toISOString();
                user.updatedAt = new Date().toISOString();
                customer.user = user;
                await this.userService.saveUser(user);
                await this.customerService.saveCustomer(customer);

                customer = await this.customerService.getCustomerByUserId(user.id);
                user.typeId = customer.id;
                await this.userService.saveUser(user);
            } else throw new HttpException({ email: ResponseMessage.EMAIL_TAKEN }, StatusCodes.BAD_REQUEST);
        }

        let customer = await this.customerService.getCustomerByUserId(user.id);
        if (!customer) {
            customer = new Customer();
            customer.user = user;
            await this.customerService.saveCustomer(customer);
        }
        const sale = await this.saleService.getSaleByUserId(body.sale);

        const registration = new Registration();
        registration.customer = customer;
        registration.registrationTime = body.registrationTime;
        registration.status = body.status;
        registration.totalCost = pricePackage.salePrice;
        registration.pricePackage = pricePackage;
        registration.notes = body.notes;
        if (sale) {
            registration.sale = sale;
            registration.lastUpdatedBy = sale.user.fullName;
        }
        if (req.user && req.user.role.description === UserRole.ADMIN) registration.lastUpdatedBy = req.user.fullName;

        try {
            await this.registrationService.saveRegistration(registration);
        } catch (err) {
            console.log(err);
        }

        return res.send(registration);
    }

    @Put('/general/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    @UseGuards(SaleGuard)
    @UsePipes(new JoiValidatorPipe(vUpdateGeneralInformationDTO))
    async cUpdateGeneralInformationRegistration(@Req() req: Request, @Res() res: Response, @Param('id') id: string, @Body() body: UpdateGeneralInformationDTO) {
        const registration = await this.registrationService.getRegistrationByField('id', id);

        if (registration.status === RegistrationStatus.PAID || registration.status === RegistrationStatus.INACTIVE)
            throw new HttpException({ status: ResponseMessage.INVALID_STATUS }, StatusCodes.BAD_REQUEST);

        if (registration.status === RegistrationStatus.APPROVED && body.status === RegistrationStatus.SUBMITTED)
            throw new HttpException({ status: ResponseMessage.INVALID_STATUS }, StatusCodes.BAD_REQUEST);

        if (
            (body.status === RegistrationStatus.APPROVED && registration.status !== RegistrationStatus.APPROVED && !registration.customer.user.isActive) ||
            (body.status === RegistrationStatus.CANCELLED && registration.status !== RegistrationStatus.CANCELLED && !registration.customer.user.isActive)
        ) {
            const password = this.dataService.generateData(8, 'lettersAndNumbers');
            registration.customer.user.password = await this.authService.encryptPassword(password, constant.default.hashingSalt);
            const hashPassword = registration.customer.user.password;
            registration.customer.user.isActive = true;
            await this.userService.saveUser(registration.customer.user);
            registration.customer.user.password = password;
            const isSend = await this.authService.sendEmailToken(registration.customer.user, EmailAction.SEND_PASSWORD, hashPassword);
            if (!isSend) {
                throw new HttpException({ errorMessage: ResponseMessage.SOMETHING_WRONG }, StatusCodes.INTERNAL_SERVER_ERROR);
            }
        }

        registration.status = body.status || registration.status;
        registration.notes = body.notes || registration.notes;
        registration.lastUpdatedBy = req.user.fullName;

        await this.registrationService.saveRegistration(registration);
        return res.send();
    }

    @Put('/specific/:id')
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    @UseGuards(SaleGuard)
    @UsePipes(new JoiValidatorPipe(vUpdateSpecificInformationDTO))
    async cUpdateSpecificInformationRegistration(@Req() req: Request, @Res() res: Response, @Param('id') id: string, @Body() body: UpdateSpecificInformationDTO) {
        const registration = await this.registrationService.getRegistrationByField('id', id);

        if (registration.status !== RegistrationStatus.SUBMITTED) throw new HttpException({ errorMessage: ResponseMessage.INVALID_STATUS }, StatusCodes.BAD_REQUEST);
        if (registration.sale && registration.sale.id !== req.user.typeId && req.user.role.description !== UserRole.ADMIN)
            throw new HttpException({ errorMessage: ResponseMessage.FORBIDDEN }, StatusCodes.FORBIDDEN);

        const pricePackage = await this.pricePackageService.getPricePackageByField('id', body.pricePackage);

        registration.pricePackage = pricePackage || registration.pricePackage;
        registration.totalCost = registration.pricePackage.salePrice;
        registration.registrationTime = body.registrationTime || registration.registrationTime;
        let user = await this.userService.findUser('email', body.email);
        let customer;
        if (user && registration.customer.user.email === body.email) {
            user.fullName = body.fullName || user.fullName;
            user.gender = body.gender || user.gender;
            user.mobile = body.mobile || user.mobile;
            await this.userService.saveUser(user);
            customer = await this.customerService.getCustomerByUserId(user.id);
        } else if (user) {
            throw new HttpException({ email: ResponseMessage.EMAIL_TAKEN }, StatusCodes.BAD_REQUEST);
        } else {
            user = new User();
            customer = new Customer();
            user.fullName = body.fullName;
            user.email = body.email;
            user.gender = body.gender;
            user.password = '';
            user.mobile = body.mobile;
            user.role = await this.userService.findRole('description', UserRole.CUSTOMER);
            user.createdAt = new Date().toISOString();
            user.updatedAt = new Date().toISOString();
            customer.user = user;
            await this.userService.saveUser(user);
            await this.customerService.saveCustomer(customer);

            customer = await this.customerService.getCustomerByUserId(user.id);
            user.typeId = customer.id;
            await this.userService.saveUser(user);
        }
        registration.customer = customer;

        await this.registrationService.saveRegistration(registration);
        return res.send();
    }

    @Put('/user/:id')
    @UseGuards(CommonGuard)
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    @UsePipes(new JoiValidatorPipe(vUpdateRegistrationByUserDTO))
    async cEditRegistrationByUser(@Req() req: Request, @Res() res: Response, @Param('id') id: string, @Body() body: UpdateRegistrationByUserDTO) {
        const registration = await this.registrationService.getRegistrationByField('id', id);

        if (!registration) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);
        if (registration.customer.user.id !== req.user.id) throw new HttpException({ errorMessage: ResponseMessage.FORBIDDEN }, StatusCodes.FORBIDDEN);
        if (registration.status !== RegistrationStatus.SUBMITTED) throw new HttpException({ status: ResponseMessage.ACTION_NOT_ALLOW }, StatusCodes.METHOD_NOT_ALLOWED);

        const pricePackage = await this.pricePackageService.getPricePackageByField('id', body.pricePackage);
        registration.pricePackage = pricePackage || registration.pricePackage;
        registration.notes = body.notes || registration.notes;

        await this.registrationService.saveRegistration(registration);

        return res.send();
    }

    @Put('/activate/:id')
    @UseGuards(CommonGuard)
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    async cActivateRegistration(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        const registration = await this.registrationService.getRegistrationByField('id', id);
        if (!registration) throw new HttpException({ errorMessage: ResponseMessage.REGISTRATION_NOT_FOUND }, StatusCodes.NOT_FOUND);
        if (registration.status !== RegistrationStatus.APPROVED) throw new HttpException({ status: ResponseMessage.INVALID_STATUS }, StatusCodes.BAD_REQUEST);

        const user = req.user;

        const existedRegistration = (await this.registrationService.getExistedRegistration(registration.pricePackage.subject.id, user.email)).filter((item) => item.status === RegistrationStatus.PAID);
        if (existedRegistration.length > 0) throw new HttpException({ errorMessage: ResponseMessage.DUPLICATED_REGISTRATION }, StatusCodes.BAD_REQUEST);

        const customer = await this.customerService.getCustomerByUserId(user.id);
        if (!customer) throw new HttpException({ errorMessage: ResponseMessage.UNAUTHORIZED }, StatusCodes.UNAUTHORIZED);
        if (customer.balance < registration.totalCost) throw new HttpException({ balance: ResponseMessage.BALANCE_NOT_ENOUGH }, StatusCodes.BAD_REQUEST);
        customer.balance = customer.balance - registration.totalCost;
        await this.customerService.saveCustomer(customer);

        registration.validFrom = new Date().toISOString();
        registration.validTo = this.dateService.calculateValidTo(registration.validFrom, registration.pricePackage.duration);
        registration.status = RegistrationStatus.PAID;
        await this.registrationService.saveRegistration(registration);
        return res.send();
    }

    @Put('/cancel/:id')
    @UseGuards(CommonGuard)
    @ApiParam({ name: 'id', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    async cCancelRegistration(@Res() res: Response, @Param('id') id: string) {
        const registration = await this.registrationService.getRegistrationByField('id', id);

        if (!registration) throw new HttpException({ errorMessage: ResponseMessage.NOT_FOUND }, StatusCodes.NOT_FOUND);
        if (registration.status !== RegistrationStatus.SUBMITTED && registration.status !== RegistrationStatus.APPROVED)
            throw new HttpException({ status: ResponseMessage.INVALID_STATUS }, StatusCodes.BAD_REQUEST);

        registration.status = RegistrationStatus.CANCELLED;
        await this.registrationService.saveRegistration(registration);
        return res.send();
    }

    @Cron(CronExpression.EVERY_12_HOURS)
    async cCheckValidRegistration() {
        const today = new Date().toISOString();
        const registrations = await this.registrationService.getPaidRegistrationByDay(today);

        Promise.all(
            registrations.map(async (item) => {
                item.status = RegistrationStatus.INACTIVE;
                await this.registrationService.saveRegistration(item);
            }),
        );
    }
}
