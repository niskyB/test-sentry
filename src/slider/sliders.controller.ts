import { QueryJoiValidatorPipe } from './../core/pipe/queryValidator.pipe';
import { vFilterSlidersDTO, FilterSlidersDTO } from './dto';
import { Controller, Res, UsePipes, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SliderService } from './slider.service';
import { Response } from 'express';

@ApiTags('sliders')
@ApiBearerAuth()
@Controller('sliders')
export class SlidersController {
    constructor(private readonly sliderService: SliderService) {}

    @Get('')
    @UsePipes(new QueryJoiValidatorPipe(vFilterSlidersDTO))
    async cFilterSliders(@Res() res: Response, @Query() queries: FilterSlidersDTO) {
        const { title, backLink, userId, createdAt, currentPage, pageSize, isShow } = queries;

        const result = await this.sliderService.filterSliders(title, backLink, userId, createdAt, currentPage, pageSize, isShow);
        console.log(result);

        result.data = result.data.map((item) => {
            if (item.marketing) {
                item.marketing.user.password = '';
                item.marketing.user.token = '';
            }
            return item;
        }, []);
        return res.send(result);
    }
}
