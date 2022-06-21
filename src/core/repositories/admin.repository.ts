import { Admin } from './../models';
import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';

@EntityRepository(Admin)
export class AdminRepository extends RepositoryService<Admin> {}
