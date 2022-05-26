import { LessonType } from './../models';
import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';

@EntityRepository(LessonType)
export class LessonTypeRepository extends RepositoryService<LessonType> {}
