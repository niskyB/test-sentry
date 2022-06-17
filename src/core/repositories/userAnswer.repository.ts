import { UserAnswer } from './../models';
import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';

@EntityRepository(UserAnswer)
export class UserAnswerRepository extends RepositoryService<UserAnswer> {}
