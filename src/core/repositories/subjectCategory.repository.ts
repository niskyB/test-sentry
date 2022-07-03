import { SubjectCategory } from './../models';
import { EntityRepository } from 'typeorm';
import { SystemSettingRepositoryService } from '../providers';

@EntityRepository(SubjectCategory)
export class SubjectCategoryRepository extends SystemSettingRepositoryService<SubjectCategory> {}
