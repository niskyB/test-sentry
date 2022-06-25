import { QuizResult } from './../core/models';
import { QuizResultRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuizResultService {
    constructor(private readonly quizResultRepository: QuizResultRepository) {}

    async saveQuizResult(quizResult: QuizResult): Promise<QuizResult> {
        return await this.quizResultRepository.save(quizResult);
    }

    async getQuizResultByField(field: keyof QuizResult, value: any): Promise<QuizResult> {
        return await this.quizResultRepository
            .createQueryBuilder('quiz_result')
            .where(`quiz_result.${field.toString()} = (:value)`, { value })
            .leftJoinAndSelect('quiz_result.attendedQuestions', 'attendedQuestions')
            .leftJoinAndSelect('attendedQuestions.questionInQuiz', 'questionInQuiz')
            .leftJoinAndSelect('questionInQuiz.question', 'question')
            .leftJoinAndSelect('question.answers', 'answers')
            .getOne();
    }
}
