import { DateService } from './../core/providers/date/date.service';
import { CommonGuard, MarketingGuard } from './../auth/guard';
import { QueryJoiValidatorPipe } from './../core/pipe';
import { Controller, Res, Get, UsePipes, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { RegistrationService } from './registration.service';
import { FilterMyRegistrationsDTO, FilterRegistrationsDTO, StatisticRegistrationsDTO, vFilterMyRegistrationsDTO, vFilterRegistrationsDTO, vStatisticRegistrationsDTO } from './dto';

@ApiTags('registrations')
@ApiBearerAuth()
@Controller('registrations')
export class RegistrationsController {
    constructor(private readonly registrationService: RegistrationService, private readonly dateService: DateService) {}

    @Get('')
    @UsePipes(new QueryJoiValidatorPipe(vFilterRegistrationsDTO))
    async cFilterRegistrations(@Res() res: Response, @Query() queries: FilterRegistrationsDTO) {
        const { subject, validFrom, validTo, email, status, currentPage, pageSize, order, orderBy } = queries;
        const result = await this.registrationService.filterRegistrations(subject, validFrom, validTo, status, email, currentPage, pageSize, order, orderBy);
        return res.send(result);
    }

    @Get('/statistics')
    @UseGuards(MarketingGuard)
    @UsePipes(new QueryJoiValidatorPipe(vStatisticRegistrationsDTO))
    @UsePipes()
    async cGetRegistrationsStatistics(@Res() res: Response, @Query() queries: StatisticRegistrationsDTO) {
        const days = this.dateService.calculateNDaysBack(7);
        const result = await Promise.all(days.map(async (day) => await this.registrationService.getCountByDay(day, queries.status)));

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
