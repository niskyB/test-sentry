import { LessonType } from './../models';
import { EntityRepository } from 'typeorm';
import { SystemSettingRepositoryService } from '../providers';

@EntityRepository(LessonType)
export class LessonTypeRepository extends SystemSettingRepositoryService<LessonType> {}
