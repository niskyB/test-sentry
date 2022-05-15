import { Controller, Post } from '@nestjs/common';

@Controller('slider')
export class SliderController {
    @Post('')
    async cCreateSlider() {
        return;
    }
}
