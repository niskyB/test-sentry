import { RegistrationService } from './../registration/registration.service';
import { DateService } from './../core/providers';
import { Controller, Get, Query, Res, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryJoiValidatorPipe } from '../core/pipe';
import { MarketingGuard } from '../auth/guard';
import { UserService } from './user.service';
import { Response } from 'express';
import { StatisticUserDTO, UserStatisticOption, vStatisticUserDTO } from './dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UserService, private readonly dateService: DateService, private readonly registrationService: RegistrationService) {}

    @Get('/statistics')
    @UseGuards(MarketingGuard)
    @UsePipes(new QueryJoiValidatorPipe(vStatisticUserDTO))
    @UsePipes()
    async cGetRegistrationsStatistics(@Res() res: Response, @Query() queries: StatisticUserDTO) {
        const days = this.dateService.calculateNDaysBack(7);
        let result;
        if (queries.option === UserStatisticOption.NEWLY_REGISTER) result = await Promise.all(days.map(async (day) => await this.userService.getNewUserByDay(day)));
        else {
            result = await Promise.all(
                days.map(async (day) => {
                    const registrations = await this.registrationService.getCountByDayAndSubject(day, '');
                    const users = new Set();
                    registrations.data.forEach((item) => users.add(item.customer.user));
                    return { value: users.size, date: registrations.date };
                }),
            );
        }

        return res.send(result);
    }
}
