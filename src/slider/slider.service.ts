import { SliderRepository } from './../core/repositories';
import { Slider } from './../core/models';
import { Injectable } from '@nestjs/common';
import { Brackets } from 'typeorm';
import { FilterService } from '../core/providers';

@Injectable()
export class SliderService {
    constructor(private readonly sliderRepository: SliderRepository, private readonly filterService: FilterService) {}

    async saveSlider(slider: Slider): Promise<Slider> {
        return await this.sliderRepository.save(slider);
    }

    async getSliderByField(field: keyof Slider, value: any): Promise<Slider> {
        return await this.sliderRepository
            .createQueryBuilder('slider')
            .where(`slider.${field.toString()} = (:value)`, { value })
            .leftJoinAndSelect('slider.marketing', 'marketing')
            .leftJoinAndSelect('marketing.user', 'user')
            .getOne();
    }

    async filterSliders(title: string, backLink: string, userId: string, createdAt: string, currentPage: number, pageSize: number, isShow: boolean): Promise<{ data: Slider[]; count: number }> {
        try {
            const isShowValue = this.filterService.getMinMaxValue(isShow);
            const date = new Date(createdAt);

            let query = this.sliderRepository
                .createQueryBuilder('slider')
                .where(`slider.title LIKE (:title)`, { title: `%${title}%` })
                .andWhere(`slider.backLink LIKE (:backLink)`, { backLink: `%${backLink}%` })
                .andWhere(`slider.createdAt >= (:createdAt)`, { createdAt: date })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('slider.isShow = :isShowMinValue', {
                            isShowMinValue: isShowValue.minValue,
                        }).orWhere('slider.isShow = :isShowMaxValue', { isShowMaxValue: isShowValue.maxValue });
                    }),
                )
                .leftJoinAndSelect('slider.marketing', 'marketing')
                .leftJoinAndSelect('marketing.user', 'user');
            if (userId) query = query.andWhere('user.id LIKE (:userId)', { userId: `%${userId}%` });

            const sliders = await query
                .orderBy(`slider.createdAt`, 'DESC')
                .skip(currentPage * pageSize)
                .take(pageSize)
                .getMany();

            const count = await query.getCount();

            return { data: sliders, count };
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }
    }
}
