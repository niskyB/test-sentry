import { QuestionLevel } from './../models';
import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';

@EntityRepository(QuestionLevel)
export class QuestionLevelRepository extends RepositoryService<QuestionLevel> {}
