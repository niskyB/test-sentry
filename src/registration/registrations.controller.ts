import { CommonGuard } from './../auth/guard';
import { QueryJoiValidatorPipe } from './../core/pipe';
import { Controller, Res, Get, UsePipes, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { RegistrationService } from './registration.service';
import { FilterMyRegistrationsDTO, FilterRegistrationsDTO, vFilterMyRegistrationsDTO, vFilterRegistrationsDTO } from './dto';

@ApiTags('registrations')
@ApiBearerAuth()
@Controller('registrations')
export class RegistrationsController {
    constructor(private readonly registrationService: RegistrationService) {}

    @Get('')
    @UsePipes(new QueryJoiValidatorPipe(vFilterRegistrationsDTO))
    async cFilterRegistrations(@Res() res: Response, @Query() queries: FilterRegistrationsDTO) {
        console.log(queries);
        const { subject, validFrom, validTo, email, status, currentPage, pageSize, order, orderBy } = queries;
        const result = await this.registrationService.filterRegistrations(subject, validFrom, validTo, status, email, currentPage, pageSize, order, orderBy);
        console.log(result);
        return res.send(result);
    }

    @Get('/me')
    @UseGuards(CommonGuard)
    @UsePipes(new QueryJoiValidatorPipe(vFilterMyRegistrationsDTO))
    async cFilterMyRegistrations(@Req() req: Request, @Res() res: Response, @Query() queries: FilterMyRegistrationsDTO) {
        const { name, category, isFeature, order, currentPage, pageSize, status } = queries;
        const result = await this.registrationService.filterMyRegistrations(req.user.id, name, category, isFeature, order, status, currentPage, pageSize);
        return res.send(result);
    }
}
