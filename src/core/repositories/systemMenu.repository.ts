import { EntityRepository } from 'typeorm';
import { SystemMenu } from '../models';
import { SystemSettingRepositoryService } from '../providers';

@EntityRepository(SystemMenu)
export class SystemMenuRepository extends SystemSettingRepositoryService<SystemMenu> {}
