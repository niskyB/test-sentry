import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';
import { BlogCategory } from '../models';

@EntityRepository(BlogCategory)
export class BlogCategoryRepository extends RepositoryService<BlogCategory> {}
