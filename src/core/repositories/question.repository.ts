import { Question } from './../models';
import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';

@EntityRepository(Question)
export class QuestionRepository extends RepositoryService<Question> {}
