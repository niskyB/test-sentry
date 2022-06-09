import { Quiz } from './../models';
import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';

@EntityRepository(Quiz)
export class QuizRepository extends RepositoryService<Quiz> {}
