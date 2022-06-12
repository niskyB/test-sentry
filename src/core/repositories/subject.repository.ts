import { Subject } from './../models';
import { EntityRepository } from 'typeorm';
import { RepositoryService } from '../providers';

@EntityRepository(Subject)
export class SubjectRepository extends RepositoryService<Subject> {
    public async findOneByField(field: keyof Subject, value: any): Promise<Subject> {
        return await this.createQueryBuilder('subject').where(`subject.${field.toString()} = :value`, { value }).leftJoinAndSelect('subject.assignTo', 'assignTo').getOne();
    }
}
