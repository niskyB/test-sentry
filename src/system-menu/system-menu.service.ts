import { SortOrder } from './../core/interface';
import { SystemMenuRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';
import { SystemMenu } from '../core/models';

@Injectable()
export class SystemMenuService {
    constructor(private readonly systemMenuRepository: SystemMenuRepository) {}

    async getSystemMenuByField(field: keyof SystemMenu, value: any): Promise<SystemMenu> {
        return await this.systemMenuRepository.findOneByField(field, value);
    }

    async saveSystemMenu(systemMenu: SystemMenu): Promise<SystemMenu> {
        return await this.systemMenuRepository.save(systemMenu);
    }

    async filterSystemMenus(status: boolean, value: string, order: SortOrder, orderBy: string, currentPage: number, pageSize: number): Promise<{ data: SystemMenu[]; count: number }> {
        return await this.systemMenuRepository.filterSetting(status, value, order, orderBy, currentPage, pageSize);
    }
}
