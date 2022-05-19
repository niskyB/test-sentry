import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';
import { Blog } from '../models';

@EntityRepository(Blog)
export class BlogRepository extends RepositoryService<Blog> {}
