import { EmailAction } from './../core/interface/email.enum';
import { SaleService } from './../sale/sale.service';
import { DataService } from './../core/providers/fake-data/data.service';
import { CustomerService } from './../customer/customer.service';
import { Customer, RegistrationStatus, User, UserRole } from './../core/models';
import { Body, Controller, HttpException, Param, Post, Put, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from 'src/auth/auth.service';
import { SaleGuard } from 'src/auth/guard/sale.guard';
import { ResponseMessage } from 'src/core/interface';
import { Registration } from 'src/core/models';
import { JoiValidatorPipe } from 'src/core/pipe';
import { PricePackageService } from 'src/price-package/price-package.service';
import { UserService } from 'src/user/user.service';
import { CreateRegistrationDTO, UpdateRegistrationDTO, vCreateRegistrationDTO, vUpdateRegistrationDTO } from './dto';
import { RegistrationService } from './registration.service';
import { constant } from '../core';

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
    ) {}

    @Post('')
    @UsePipes(new JoiValidatorPipe(vCreateRegistrationDTO))
    async cCreateLesson(@Req() req: Request, @Res() res: Response, @Body() body: CreateRegistrationDTO) {
        const pricePackage = await this.pricePackageService.getPricePackageByField('id', body.pricePackage);
        if (!pricePackage) throw new HttpException({ errorMessage: ResponseMessage.INVALID_TYPE }, StatusCodes.BAD_REQUEST);

        let user;
        if (req.user) user = req.user;
        else {
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
            }
        }

        const customer = await this.customerService.getCustomerByUserId(user.id);
        const sale = await this.saleService.getSaleByUserId(body.sale);

        const registration = new Registration();
        registration.customer = customer;
        registration.registrationTime = body.registrationTime;
        registration.status = body.status;
        registration.totalCost = pricePackage.salePrice;
        registration.validForm = body.validFrom;
        registration.validTo = body.validTo;
        registration.pricePackage = pricePackage;
        registration.notes = body.note;
        if (sale) registration.sale = sale;

        try {
            await this.registrationService.saveRegistration(registration);
        } catch (err) {
            console.log(err);
        }

        return res.send(registration);
    }

    @Put('/:id')
    @ApiParam({ name: 'userId', example: 'TVgJIjsRFmIvyjUeBOLv4gOD3eQZY' })
    @UseGuards(SaleGuard)
    @UsePipes(new JoiValidatorPipe(vUpdateRegistrationDTO))
    async cUpdateRegistration(@Req() req: Request, @Res() res: Response, @Body() body: UpdateRegistrationDTO, @Param('id') id: string) {
        const registration = await this.registrationService.getRegistrationByField('id', id);

        registration.status = body.status || registration.status;
        if (body.status === RegistrationStatus.PAID) {
            const password = this.dataService.generateData(8, 'lettersAndNumbers');
            registration.customer.user.password = await this.authService.encryptPassword(password, constant.default.hashingSalt);
            registration.customer.user.isActive = true;
            await this.userService.saveUser(registration.customer.user);
            registration.customer.user.password = password;
            const isSend = await this.authService.sendEmailToken(registration.customer.user, EmailAction.SEND_PASSWORD);
            if (!isSend) {
                throw new HttpException({ errorMessage: ResponseMessage.SOMETHING_WRONG }, StatusCodes.INTERNAL_SERVER_ERROR);
            }
        }

        if (body.status !== RegistrationStatus.SUBMITTED || (registration.sale && registration.sale.id !== req.user.typeId)) {
            await this.registrationService.saveRegistration(registration);
            return res.send();
        }

        const pricePackage = await this.pricePackageService.getPricePackageByField('id', body.pricePackage);

        registration.pricePackage = pricePackage || registration.pricePackage;
        registration.totalCost = registration.pricePackage.salePrice;
        registration.validForm = body.validFrom || registration.validForm;
        registration.validTo = body.validTo || registration.validTo;
        registration.registrationTime = body.registrationTime || registration.registrationTime;
        registration.notes = body.note || registration.notes;
        let user = await this.userService.findUser('email', body.email);
        let customer;
        if (user) {
            user.fullName = body.fullName || user.fullName;
            user.gender = body.gender || user.gender;
            user.mobile = body.mobile || user.mobile;
            await this.userService.saveUser(user);
            customer = await this.customerService.getCustomerByUserId(user.id);
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
}
