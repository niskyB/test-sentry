import { SubjectTopic } from './../core/models';
import { SubjectTopicRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SubjectTopicService {
    constructor(private readonly subjectTopicRepository: SubjectTopicRepository) {}

    async saveSubjectTopic(subjectTopic: SubjectTopic): Promise<SubjectTopic> {
        return await this.subjectTopicRepository.save(subjectTopic);
    }

    async getSubjectTopicByLessonId(id: string): Promise<SubjectTopic> {
        return await this.subjectTopicRepository.createQueryBuilder('subject_topic').leftJoinAndSelect('subject_topic.lesson', 'lesson').where('lesson.id = (:id)', { id }).getOne();
    }
}
