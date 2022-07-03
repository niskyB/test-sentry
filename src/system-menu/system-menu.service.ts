import { FilterService } from './../core/providers/filter/filter.service';
import { SortOrder } from './../core/interface';
import { SystemMenuRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';
import { SystemMenu } from '../core/models';
import { Brackets } from 'typeorm';

@Injectable()
export class SystemMenuService {
    constructor(private readonly systemMenuRepository: SystemMenuRepository, private readonly filterService: FilterService) {}

    async getSystemMenuByField(field: keyof SystemMenu, value: any): Promise<SystemMenu> {
        return await this.systemMenuRepository.findOneByField(field, value);
    }

    async saveSystemMenu(systemMenu: SystemMenu): Promise<SystemMenu> {
        return await this.systemMenuRepository.save(systemMenu);
    }

    async filterSystemMenus(status: boolean, value: string, order: SortOrder, orderBy: string, currentPage: number, pageSize: number): Promise<{ data: SystemMenu[]; count: number }> {
        let systemMenus, count;
        const isActiveValue = this.filterService.getMinMaxValue(status);
        try {
            systemMenus = await this.systemMenuRepository
                .createQueryBuilder('SystemMenu')
                .where('SystemMenu.value LIKE (:value)', { value: `%${value}%` })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('SystemMenu.isActive = :isActiveMinValue', {
                            isActiveMinValue: isActiveValue.minValue,
                        }).orWhere('SystemMenu.isActive = :isActiveMaxValue', { isActiveMaxValue: isActiveValue.maxValue });
                    }),
                )
                .orderBy(`SystemMenu.${orderBy}`, order)
                .skip(currentPage * pageSize)
                .take(pageSize)
                .getMany();

            count = await this.systemMenuRepository
                .createQueryBuilder('SystemMenu')
                .where('SystemMenu.value LIKE (:value)', { value: `%${value}%` })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('SystemMenu.isActive = :isActiveMinValue', {
                            isActiveMinValue: isActiveValue.minValue,
                        }).orWhere('SystemMenu.isActive = :isActiveMaxValue', { isActiveMaxValue: isActiveValue.maxValue });
                    }),
                )
                .getCount();
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }
        return { data: systemMenus, count };
    }
}
