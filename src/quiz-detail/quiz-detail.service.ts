import { QuizDetailRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';
import { QuizDetail } from '../core/models';

@Injectable()
export class QuizDetailService {
    constructor(private readonly quizDetailRepository: QuizDetailRepository) {}

    async saveQuizDetail(quizDetail: QuizDetail): Promise<QuizDetail> {
        return await this.quizDetailRepository.save(quizDetail);
    }
}
