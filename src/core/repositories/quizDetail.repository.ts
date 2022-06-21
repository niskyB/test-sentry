import { QuizDetail } from './../models';
import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';

@EntityRepository(QuizDetail)
export class QuizDetailRepository extends RepositoryService<QuizDetail> {}
