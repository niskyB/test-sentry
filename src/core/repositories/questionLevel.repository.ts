import { QuestionLevel } from './../models';
import { EntityRepository } from 'typeorm';
import { SystemSettingRepositoryService } from '../providers';

@EntityRepository(QuestionLevel)
export class QuestionLevelRepository extends SystemSettingRepositoryService<QuestionLevel> {}
