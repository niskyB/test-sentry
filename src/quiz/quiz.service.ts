import { Quiz } from './../core/models';
import { QuizRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuizService {
    constructor(private readonly quizRepository: QuizRepository) {}

    async saveQuiz(quiz: Quiz): Promise<Quiz> {
        return await this.quizRepository.save(quiz);
    }

    async deleteQuiz(quiz: Quiz) {
        return await this.quizRepository.delete(quiz);
    }

    async getQuizByField(field: keyof Quiz, value: any): Promise<Quiz> {
        return await this.quizRepository
            .createQueryBuilder('quiz')
            .where(`quiz.${field.toString()} = (:value)`, { value })
            .andWhere('quiz.isOld = (:isOld)', { isOld: false })
            .leftJoinAndSelect('quiz.subject', 'subject')
            .leftJoinAndSelect('subject.assignTo', 'assignTo')
            .leftJoinAndSelect('assignTo.user', 'user')
            .leftJoinAndSelect('quiz.type', 'type')
            .leftJoinAndSelect('quiz.level', 'level')
            .getOne();
    }

    async filterQuizzes({ name, subject, type }): Promise<{ data: Quiz[]; count: number }> {
        let quizzes, count;
        const query = this.quizRepository
            .createQueryBuilder('quiz')
            .where('quiz.name LIKE (:name)', { name: `%${name}%` })
            .andWhere('quiz.isOld = (:isOld)', { isOld: false })
            .leftJoinAndSelect('quiz.subject', 'subject')
            .andWhere('subject.id LIKE (:subjectId)', { subjectId: `%${subject}%` })
            .leftJoinAndSelect('quiz.type', 'type')
            .andWhere('type.id LIKE (:typeId)', { typeId: `%${type}%` });

        try {
            quizzes = await query.leftJoinAndSelect('quiz.level', 'level').getMany();
            count = await query.getCount();
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }
        return { data: quizzes, count };
    }

    async filterSimulationExams(subject: string, name: string, currentPage: number, pageSize: number): Promise<{ data: Quiz[]; count: number }> {
        let simulationExams, count;
        const query = this.quizRepository
            .createQueryBuilder('quiz')
            .leftJoinAndSelect('quiz.subject', 'subject')
            .where('subject.id LIKE (:subjectId)', { subjectId: `%${subject}%` })
            .andWhere('quiz.name LIKE (:name)', { name: `%${name}%` })
            .andWhere('quiz.isOld = (:isOld)', { isOld: false })
            .leftJoinAndSelect('quiz.type', 'type')
            .andWhere('type.description = (:type)', { type: 'Simulation' });
        try {
            simulationExams = await query
                .leftJoinAndSelect('quiz.level', 'level')
                .skip(currentPage * pageSize)
                .take(pageSize)
                .getMany();

            count = await query.getCount();
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }

        return { data: simulationExams, count };
    }
}
