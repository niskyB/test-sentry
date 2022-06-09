import { SubjectTopic } from './../models';
import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';

@EntityRepository(SubjectTopic)
export class SubjectTopicRepository extends RepositoryService<SubjectTopic> {}
