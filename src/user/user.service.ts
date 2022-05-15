import { SortOrder } from './../core/interface';
import { Injectable } from '@nestjs/common';
import { Role, User } from '../core/models';
import { RoleRepository, UserRepository } from '../core/repositories';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository, private readonly roleRepository: RoleRepository) {}

    async saveUser(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }

    async findUser(field: keyof User, value: any): Promise<User> {
        let user = null;
        try {
            user = await this.userRepository.createQueryBuilder('user').where(`user.${field} = :value`, { value }).leftJoinAndSelect('user.role', 'role').getOne();
        } catch (err) {
            console.log(err);
        }

        return user;
    }

    async findUsers(field: keyof User, value: any): Promise<User[]> {
        return await this.userRepository.findManyByField(field, value);
    }

    async filterUsers(name: string, currentPage: number, pageSize: number, orderBy: string, order: SortOrder): Promise<{ data: User[]; count: number }> {
        try {
            const users = await this.userRepository
                .createQueryBuilder('user')
                .where(`user.name LIKE (:name)`, {
                    name: `%${name}%`,
                })
                .orderBy(`user.${orderBy}`, order)
                .skip(currentPage * pageSize)
                .take(pageSize)
                .getMany();

            const count = await this.userRepository
                .createQueryBuilder('user')
                .where(`user.name LIKE (:name)`, {
                    name: `%${name}%`,
                })
                .getCount();

            return { data: users, count };
        } catch (err) {
            return { data: [], count: 0 };
        }
    }

    async findRole(field: keyof Role, value: any): Promise<Role> {
        return await this.roleRepository.findOneByField(field, value);
    }
}
