import { QuizType } from './../models';
import { EntityRepository } from 'typeorm';
import { SystemSettingRepositoryService } from '../providers';

@EntityRepository(QuizType)
export class QuizTypeRepository extends SystemSettingRepositoryService<QuizType> {}
