import { QuestionInQuiz } from './../models';
import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';

@EntityRepository(QuestionInQuiz)
export class QuestionInQuizRepository extends RepositoryService<QuestionInQuiz> {}
