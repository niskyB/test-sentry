import { EntityRepository } from 'typeorm';
import { SystemMenu } from '../models';
import { RepositoryService } from '../providers';

@EntityRepository(SystemMenu)
export class SystemMenuRepository extends RepositoryService<SystemMenu> {}
