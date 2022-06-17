import { AttendedQuestion } from './../models';
import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';

@EntityRepository(AttendedQuestion)
export class AttendedQuestionRepository extends RepositoryService<AttendedQuestion> {}
