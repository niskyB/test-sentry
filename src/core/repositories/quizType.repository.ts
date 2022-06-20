import { QuizType } from './../models';
import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';

@EntityRepository(QuizType)
export class QuizTypeRepository extends RepositoryService<QuizType> {}
