import { Registration } from './../models';
import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';

@EntityRepository(Registration)
export class RegistrationRepository extends RepositoryService<Registration> {}
