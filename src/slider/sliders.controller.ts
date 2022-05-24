import { QueryJoiValidatorPipe } from './../core/pipe/queryValidator.pipe';
import { vFilterSlidersDTO, FilterSlidersDTO } from './dto';
import { MarketingGuard } from './../auth/guard';
import { Controller, Res, UseGuards, UsePipes, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SliderService } from './slider.service';
import { Response } from 'express';

@ApiTags('sliders')
@ApiBearerAuth()
@UseGuards(MarketingGuard)
@Controller('sliders')
export class SlidersController {
    constructor(private readonly sliderService: SliderService) {}

    @Get('')
    @UsePipes(new QueryJoiValidatorPipe(vFilterSlidersDTO))
    async cFilterSliders(@Res() res: Response, @Query() queries: FilterSlidersDTO) {
        const { title, userId, createdAt, currentPage, pageSize, isShow } = queries;

        const result = await this.sliderService.filterSliders(title, userId, createdAt, currentPage, pageSize, isShow);
        return res.send(result);
    }
}
