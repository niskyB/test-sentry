import { QuizResult } from './../models';
import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';

@EntityRepository(QuizResult)
export class QuizResultRepository extends RepositoryService<QuizResult> {}
