import { EntityRepository } from 'typeorm';
import { SystemSettingRepositoryService } from '../providers';
import { BlogCategory } from '../models';

@EntityRepository(BlogCategory)
export class BlogCategoryRepository extends SystemSettingRepositoryService<BlogCategory> {}
