import { QueryJoiValidatorPipe } from './../core/pipe/queryValidator.pipe';
import { Controller, Res, Get, UsePipes, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { RegistrationService } from './registration.service';
import { FilterRegistrationsDTO, vFilterRegistrationsDTO } from './dto';

@ApiTags('registrations')
@ApiBearerAuth()
@Controller('registrations')
export class RegistrationsController {
    constructor(private readonly registrationService: RegistrationService) {}

    @Get('')
    @UsePipes(new QueryJoiValidatorPipe(vFilterRegistrationsDTO))
    async cFilterRegistrations(@Res() res: Response, @Query() queries: FilterRegistrationsDTO) {
        const { subject, validFrom, validTo, email, status } = queries;
        const result = await this.registrationService.filterRegistrations(subject, validFrom, validTo, status, email);
        return res.send(result);
    }
}
