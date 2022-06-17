import { Body, Controller, HttpException, Post, Req, Res, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from 'src/auth/auth.service';
import { AdminGuard } from 'src/auth/guard';
import { SaleGuard } from 'src/auth/guard/sale.guard';
import { ResponseMessage } from 'src/core/interface';
import { Registration } from 'src/core/models';
import { JoiValidatorPipe } from 'src/core/pipe';
import { PricePackageService } from 'src/price-package/price-package.service';
import { SubjectService } from 'src/subject/subject.service';
import { UserService } from 'src/user/user.service';
import { CreateRegistrationDTO, vCreateRegistrationDTO } from './dto/createRegistration.dto';
import { RegistrationService } from './registration.service';

@Controller('registration')
@ApiBearerAuth()
// @UseGuards(SaleGuard)
export class RegistrationController {
    constructor(
        private readonly registrationService: RegistrationService,
        private readonly authService: AuthService,
        private readonly pricePackageService: PricePackageService,
        private readonly subjectService: SubjectService,
        private readonly userService: UserService,
    ) {}

    @Post('')
    @UsePipes(new JoiValidatorPipe(vCreateRegistrationDTO))
    async cCreateLesson(@Req() req: Request, @Res() res: Response, @Body() body: CreateRegistrationDTO) {
        const subject = await this.subjectService.getSubjectByField('id', body.subject);
        if (!subject) throw new HttpException({ errorMessage: ResponseMessage.INVALID_TYPE }, StatusCodes.BAD_REQUEST);

        const pricePackage = await this.pricePackageService.getPricePackageByField('id', body.pricePackage);
        if (!pricePackage) throw new HttpException({ errorMessage: ResponseMessage.INVALID_TYPE }, StatusCodes.BAD_REQUEST);

        const registration = new Registration();
        registration.status = body.status;
        registration.totalCost = pricePackage.salePrice;
        registration.validForm = body.validFrom;
        registration.validTo = body.validTo;
        registration.customer = null;

        try {
            await this.registrationService.saveRegistration(registration);
        } catch (err) {
            console.log(err);
        }

        res.status(200);
    }
}
