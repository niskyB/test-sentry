import { QuizResult } from './../core/models';
import { QuizResultRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuizResultService {
    constructor(private readonly quizResultRepository: QuizResultRepository) {}

    async saveQuizResult(quizResult: QuizResult): Promise<QuizResult> {
        return await this.quizResultRepository.save(quizResult);
    }
}
