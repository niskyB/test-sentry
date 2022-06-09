import { SubjectTopic } from './../core/models';
import { SubjectTopicRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SubjectTopicService {
    constructor(private readonly subjectTopicRepository: SubjectTopicRepository) {}

    async saveSubjectTopic(subjectTopic: SubjectTopic): Promise<SubjectTopic> {
        return await this.subjectTopicRepository.save(subjectTopic);
    }
}
