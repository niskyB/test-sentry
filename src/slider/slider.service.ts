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

    async filterSliders(title: string, userId: string, createdAt: string, currentPage: number, pageSize: number): Promise<{ data: Slider[]; count: number }> {
        try {
            const date = new Date(createdAt);
            const sliders = await this.sliderRepository
                .createQueryBuilder('slider')
                .where(`slider.title LIKE (:title)`, {
                    title: `%${title}%`,
                })
                .andWhere(`slider.createdAt >= (:createdAt)`, { createdAt: date })
                .leftJoinAndSelect('slider.user', 'user')
                .andWhere('user.id LIKE (:userId)', { userId: `%${userId}%` })
                .orderBy(`slider.createdAt`, 'DESC')
                .skip(currentPage * pageSize)
                .take(pageSize)
                .getMany();

            const count = await this.sliderRepository
                .createQueryBuilder('slider')
                .where(`slider.title LIKE (:title)`, {
                    title: `%${title}%`,
                })
                .andWhere(`slider.createdAt >= (:createdAt)`, { createdAt: date })
                .leftJoinAndSelect('slider.user', 'user')
                .andWhere('user.id LIKE (:userId)', { userId: `%${userId}%` })
                .getCount();

            return { data: sliders, count };
        } catch (err) {
            return { data: [], count: 0 };
        }
    }
}
