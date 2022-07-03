import { Role } from '../models';
import { EntityRepository } from 'typeorm';
import { SystemSettingRepositoryService } from '../providers';

@EntityRepository(Role)
export class RoleRepository extends SystemSettingRepositoryService<Role> {}
