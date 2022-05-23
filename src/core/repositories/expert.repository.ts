import { Expert } from './../models';
import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';

@EntityRepository(Expert)
export class ExpertRepository extends RepositoryService<Expert> {}
