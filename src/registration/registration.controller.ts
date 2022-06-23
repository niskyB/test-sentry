import { SaleService } from './../sale/sale.service';
import { DataService } from './../core/providers/fake-data/data.service';
import { CustomerService } from './../customer/customer.service';
import { Customer, User, UserRole } from './../core/models';
import { Body, Controller, HttpException, Post, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from 'src/auth/auth.service';
import { SaleGuard } from 'src/auth/guard/sale.guard';
import { ResponseMessage } from 'src/core/interface';
import { Registration } from 'src/core/models';
import { JoiValidatorPipe } from 'src/core/pipe';
import { PricePackageService } from 'src/price-package/price-package.service';
import { UserService } from 'src/user/user.service';
import { CreateRegistrationDTO, vCreateRegistrationDTO } from './dto/createRegistration.dto';
import { RegistrationService } from './registration.service';
import { constant } from '../core';

@Controller('registration')
@ApiBearerAuth()
// @UseGuards(SaleGuard)
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
                const password = this.dataService.generateData(8, 'lettersAndNumbers');
                user.password = await this.authService.encryptPassword(password, constant.default.hashingSalt);
                user.gender = body.gender;
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
        if (sale) registration.sale = sale;

        try {
            await this.registrationService.saveRegistration(registration);
        } catch (err) {
            console.log(err);
        }

        return res.send(registration);
    }
}
