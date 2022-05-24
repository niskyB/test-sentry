import { Subject } from './../core/models';
import { SubjectRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SubjectService {
    constructor(private readonly subjectRepository: SubjectRepository) {}

    async saveSubject(subject: Subject): Promise<Subject> {
        return await this.subjectRepository.save(subject);
    }
}
