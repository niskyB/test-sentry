import { SliderRepository } from './../core/repositories';
import { Slider } from './../core/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SliderService {
    constructor(private readonly sliderRepository: SliderRepository) {}

    async saveSlider(slider: Slider): Promise<Slider> {
        return await this.sliderRepository.save(slider);
    }

    async getSliderByField(field: keyof Slider, value: any): Promise<Slider> {
        return await this.sliderRepository.findOneByField(field, value);
    }
}
