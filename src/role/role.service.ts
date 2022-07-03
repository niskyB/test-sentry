import { Brackets } from 'typeorm';
import { FilterService } from './../core/providers/filter/filter.service';
import { SortOrder } from './../core/interface';
import { Role } from './../core/models';
import { RoleRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoleService {
    constructor(private readonly roleRepository: RoleRepository, private readonly filterService: FilterService) {}

    async saveRole(role: Role): Promise<Role> {
        return await this.roleRepository.save(role);
    }

    async getRoleByField(field: keyof Role, value: any): Promise<Role> {
        return await this.roleRepository.findOneByField(field, value);
    }

    async filterRoles(status: boolean, value: string, order: SortOrder, orderBy: string, currentPage: number, pageSize: number): Promise<{ data: Role[]; count: number }> {
        let roles, count;
        const isActiveValue = this.filterService.getMinMaxValue(status);
        try {
            roles = await this.roleRepository
                .createQueryBuilder('Role')
                .where('Role.value LIKE (:value)', { value: `%${value}%` })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('Role.isActive = :isActiveMinValue', {
                            isActiveMinValue: isActiveValue.minValue,
                        }).orWhere('Role.isActive = :isActiveMaxValue', { isActiveMaxValue: isActiveValue.maxValue });
                    }),
                )
                .orderBy(`Role.${orderBy}`, order)
                .skip(currentPage * pageSize)
                .take(pageSize)
                .getMany();

            count = await this.roleRepository
                .createQueryBuilder('Role')
                .where('Role.value LIKE (:value)', { value: `%${value}%` })
                .andWhere(
                    new Brackets((qb) => {
                        qb.where('Role.isActive = :isActiveMinValue', {
                            isActiveMinValue: isActiveValue.minValue,
                        }).orWhere('Role.isActive = :isActiveMaxValue', { isActiveMaxValue: isActiveValue.maxValue });
                    }),
                )
                .getCount();
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }
        return { data: roles, count };
    }
}
