import { Role } from '../models';
import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';

@EntityRepository(Role)
export class RoleRepository extends RepositoryService<Role> {}
