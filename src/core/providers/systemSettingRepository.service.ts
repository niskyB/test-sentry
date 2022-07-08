import { FilterService } from './filter/filter.service';
import { SortOrder } from './../interface';
import { Brackets, Repository } from 'typeorm';

export class SystemSettingRepositoryService<T> extends Repository<T> {
    public async findOneByField(field: keyof T, value: any): Promise<T> {
        return await this.createQueryBuilder('Table').where(`Table.${field.toString()} = :value`, { value }).getOne();
    }

    public async findManyByField(field: keyof T, value: any): Promise<T[]> {
        return await this.createQueryBuilder('Table').where(`Table.${field.toString()} = :value`, { value }).getMany();
    }

    async filterSetting(status: boolean, value: string, order: SortOrder, orderBy: string, currentPage: number, pageSize: number): Promise<{ data: T[]; count: number }> {
        let data, count;
        const filterService = new FilterService();
        const isActiveValue = filterService.getMinMaxValue(status);
        try {
            data = await this.createQueryBuilder('Table')
                .where('value LIKE (:value)', { value: `%${value}%` })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('isActive = :isActiveMinValue', {
                            isActiveMinValue: isActiveValue.minValue,
                        }).orWhere('isActive = :isActiveMaxValue', { isActiveMaxValue: isActiveValue.maxValue });
                    }),
                )
                .orderBy(`Table.${orderBy}`, order)
                .skip(currentPage * pageSize)
                .take(pageSize)
                .getMany();

            count = await this.createQueryBuilder()
                .where('value LIKE (:value)', { value: `%${value}%` })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('isActive = :isActiveMinValue', {
                            isActiveMinValue: isActiveValue.minValue,
                        }).orWhere('isActive = :isActiveMaxValue', { isActiveMaxValue: isActiveValue.maxValue });
                    }),
                )
                .getCount();
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }
        return { data, count };
    }
}
