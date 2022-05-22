import { QueryJoiValidatorPipe } from './../core/pipe/queryValidator.pipe';
import { S3Service } from 'src/core/providers/s3/s3.service';
import { UserService } from '../user/user.service';
import { vFilterSlidersDTO, FilterSlidersDTO } from './dto';
import { MarketingGuard } from './../auth/guard';
import { Controller, Req, Res, UseGuards, UsePipes, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SliderService } from './slider.service';
import { Request, Response } from 'express';

@ApiTags('sliders')
@ApiBearerAuth()
@UseGuards(MarketingGuard)
@Controller('sliders')
export class SlidersController {
    constructor(private readonly sliderService: SliderService, private readonly userService: UserService, private readonly s3Service: S3Service) {}

    @Get('')
    @UsePipes(new QueryJoiValidatorPipe(vFilterSlidersDTO))
    async cFilterSliders(@Req() req: Request, @Res() res: Response, @Query() queries: FilterSlidersDTO) {
        const { title, userId, createdAt, currentPage, pageSize, isShow } = queries;

        const result = await this.sliderService.filterSliders(title, userId, createdAt, currentPage, pageSize, isShow);
        return res.send(result);
    }
}
