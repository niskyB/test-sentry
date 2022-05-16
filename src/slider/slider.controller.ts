import { MarketingGuard } from './../auth/guard';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SliderService } from './slider.service';

@ApiTags('slider')
@Controller('slider')
@UseGuards(MarketingGuard)
export class SliderController {
    constructor(private readonly sliderService: SliderService) {}

    @Post('')
    async cCreateSlider() {
        return;
    }
}
