import { SubjectCategory } from './../models';
import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';

@EntityRepository(SubjectCategory)
export class SubjectCategoryRepository extends RepositoryService<SubjectCategory> {}
