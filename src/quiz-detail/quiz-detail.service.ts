import { QuizDetailRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';
import { QuizDetail } from '../core/models';

@Injectable()
export class QuizDetailService {
    constructor(private readonly quizDetailRepository: QuizDetailRepository) {}

    async saveQuizDetail(quizDetail: QuizDetail): Promise<QuizDetail> {
        return await this.quizDetailRepository.save(quizDetail);
    }

    async getQuizDetailsByQuizId(id: string): Promise<QuizDetail[]> {
        return await this.quizDetailRepository
            .createQueryBuilder('quiz_detail')
            .leftJoinAndSelect('quiz_detail.quiz', 'quiz')
            .where('quiz.id = (:id)', { id })
            .leftJoinAndSelect('quiz_detail.question', 'question')
            .getMany();
    }
}
