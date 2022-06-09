import { Answer } from './../models';
import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';

@EntityRepository(Answer)
export class AnswerRepository extends RepositoryService<Answer> {}
