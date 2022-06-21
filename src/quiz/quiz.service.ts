import { Quiz } from './../core/models';
import { QuizRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuizService {
    constructor(private readonly quizRepository: QuizRepository) {}

    async saveQuiz(lesson: Quiz): Promise<Quiz> {
        return await this.quizRepository.save(lesson);
    }

    async getQuizByField(field: keyof Quiz, value: any): Promise<Quiz> {
        return await this.quizRepository.findOneByField(field, value);
    }

    async filterQuizzes({ name, subject, type }): Promise<{ data: Quiz[]; count: number }> {
        let quizzes, count;
        try {
            quizzes = await this.quizRepository
                .createQueryBuilder('quiz')
                .where('quiz.name LIKE (:name)', { name: `%${name}%` })
                .leftJoinAndSelect('quiz.subject', 'subject')
                .andWhere('subject.id LIKE (:subjectId)', { subjectId: `%${subject}%` })
                .leftJoinAndSelect('quiz.type', 'type')
                .andWhere('type.id LIKE (:typeId)', { typeId: `%${type}%` })
                .leftJoinAndSelect('quiz.level', 'level')
                .getMany();
            count = await this.quizRepository
                .createQueryBuilder('quiz')
                .where('quiz.name LIKE (:name)', { name: `%${name}%` })
                .leftJoinAndSelect('quiz.subject', 'subject')
                .andWhere('subject.id LIKE (:subjectId)', { subjectId: `%${subject}%` })
                .leftJoinAndSelect('quiz.type', 'type')
                .andWhere('type.id LIKE (:typeId)', { typeId: `%${type}%` })
                .getCount();
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }
        return { data: quizzes, count };
    }
}
