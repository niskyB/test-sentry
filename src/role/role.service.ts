import { SortOrder } from './../core/interface';
import { Role } from './../core/models';
import { RoleRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoleService {
    constructor(private readonly roleRepository: RoleRepository) {}

    async saveRole(role: Role): Promise<Role> {
        return await this.roleRepository.save(role);
    }

    async getRoleByField(field: keyof Role, value: any): Promise<Role> {
        return await this.roleRepository.findOneByField(field, value);
    }

    async filterRoles(status: boolean, value: string, order: SortOrder, orderBy: string, currentPage: number, pageSize: number): Promise<{ data: Role[]; count: number }> {
        return await this.roleRepository.filterSetting(status, value, order, orderBy, currentPage, pageSize);
    }
}
