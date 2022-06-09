import { LessonDetail } from './../models';
import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';

@EntityRepository(LessonDetail)
export class LessonDetailRepository extends RepositoryService<LessonDetail> {}
