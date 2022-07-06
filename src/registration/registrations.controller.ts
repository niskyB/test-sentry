import { ResponseMessage } from './../core/interface';
import { DateService } from './../core/providers';
import { CommonGuard, MarketingGuard } from './../auth/guard';
import { QueryJoiValidatorPipe } from './../core/pipe';
import { Controller, Res, Get, UsePipes, Query, Req, UseGuards, HttpException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { RegistrationService } from './registration.service';
import {
    FilterMyRegistrationsDTO,
    FilterRegistrationsDTO,
    StatisticOrderTrendDTO,
    StatisticRegistrationsDTO,
    StatisticRevenuesDTO,
    vFilterMyRegistrationsDTO,
    vFilterRegistrationsDTO,
    vStatisticOrderTrendDTO,
    vStatisticRegistrationsDTO,
    vStatisticRevenuesDTO,
} from './dto';
import { StatusCodes } from 'http-status-codes';

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

    @Get('/revenues/statistics')
    @UseGuards(MarketingGuard)
    @UsePipes(new QueryJoiValidatorPipe(vStatisticRevenuesDTO))
    @UsePipes()
    async cGetRevenuesStatistics(@Res() res: Response, @Query() queries: StatisticRevenuesDTO) {
        const days = this.dateService.calculateNDaysBack(7);
        const result = await Promise.all(
            days.map(async (day) => {
                const registrations = await this.registrationService.getCountByDayAndSubject(day, queries.subjectCategory);
                const total = registrations.data.reduce((total, item) => (total += item.totalCost), 0);
                return { value: total, date: registrations.date };
            }),
        );

        return res.send(result);
    }

    @Get('/order-trend/statistics')
    @UseGuards(MarketingGuard)
    @UsePipes(new QueryJoiValidatorPipe(vStatisticOrderTrendDTO))
    @UsePipes()
    async cGetOrderTrendStatistics(@Res() res: Response, @Query() queries: StatisticOrderTrendDTO) {
        const { from, to } = queries;
        if (from > to) throw new HttpException({ orderTrend: ResponseMessage.FROM_LAGER_THAN_TO }, StatusCodes.BAD_REQUEST);
        const days = this.dateService.calculateDaysBetween(from, to);
        const result = await Promise.all(
            days.map(async (day) => {
                const registrations = await this.registrationService.getCountByDayAndSubject(day, '');
                const total = registrations.data.length;
                return { value: total, date: registrations.date };
            }),
        );

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
