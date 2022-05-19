import { SliderService } from './../slider/slider.service';
import { MarketingGuard } from './../auth/guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';

@ApiTags('marketing')
@ApiBearerAuth()
@UseGuards(MarketingGuard)
@Controller('marketing')
export class MarketingController {
    constructor(private readonly sliderService: SliderService) {}
}
