import { DateService } from './../core/providers';
import { ExpertGuard, MarketingGuard, RegistrationGuard } from './../auth/guard';
import { UserRole } from './../core/models';
import { QueryJoiValidatorPipe } from './../core/pipe';
import { FilterSubjectsDTO, vFilterSubjectsDTO } from './dto';
import { Controller, Res, UsePipes, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { SubjectService } from './subject.service';

@ApiTags('subjects')
@ApiBearerAuth()
@Controller('subjects')
export class SubjectsController {
    constructor(private readonly subjectService: SubjectService, private readonly dateService: DateService) {}

    @Get('/role')
    @UseGuards(ExpertGuard)
    @UsePipes()
    async cGetSubjectsByRole(@Req() req: Request, @Res() res: Response) {
        let result;
        if (req.user.role.description === UserRole.ADMIN) {
            result = await this.subjectService.getAllSubjects();
        } else {
            result = await this.subjectService.getSubjectByUserId(req.user.id);
        }

        result = result.map((item) => {
            item.assignTo.user.password = '';
            item.assignTo.user.token = '';
            return item;
        }, []);
        return res.send(result);
    }

    @Get('/statistics')
    @UseGuards(MarketingGuard)
    @UsePipes()
    async cGetSubjectsStatistics(@Res() res: Response) {
        const days = this.dateService.calculateNDaysBack(7);
        const result = await Promise.all(days.map(async (day) => await this.subjectService.getCountByDay(day)));

        return res.send(result);
    }

    @Get('')
    @UseGuards(RegistrationGuard)
    @UsePipes(new QueryJoiValidatorPipe(vFilterSubjectsDTO))
    async cFilterSubjects(@Req() req: Request, @Res() res: Response, @Query() queries: FilterSubjectsDTO) {
        const { name, isActive, isFeature, category, currentPage, createdAt, pageSize, order } = queries;

        let result;
        if (req.user && req.user.role.description === UserRole.ADMIN) result = await this.subjectService.filterSubjectsForAdmin(name, createdAt, currentPage, pageSize, isActive, isFeature, category);
        else
            result = await this.subjectService.filterSubjects(
                name,
                createdAt,
                currentPage,
                pageSize,
                isActive,
                isFeature,
                category,
                req.user && req.user.role.description === UserRole.EXPERT ? req.user.id : '',
                order,
            );

        if (result) {
            result.data = result.data.map((item) => {
                item.assignTo.user.password = '';
                item.assignTo.user.token = '';
                return item;
            }, []);
        }
        return res.send(result);
    }
}
