import { Admin } from './../core/models';
import { AdminRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
    constructor(private readonly adminRepository: AdminRepository) {}

    async getAdminByUserId(id: string): Promise<Admin> {
        return await this.adminRepository.createQueryBuilder('admin').leftJoinAndSelect('admin.user', 'user').where('user.id = (:id)', { id }).getOne();
    }

    async saveAdmin(admin: Admin): Promise<Admin> {
        return await this.adminRepository.save(admin);
    }
}
