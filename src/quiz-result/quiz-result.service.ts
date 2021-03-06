import { QuizResult } from './../core/models';
import { QuizResultRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuizResultService {
    constructor(private readonly quizResultRepository: QuizResultRepository) {}

    async saveQuizResult(quizResult: QuizResult): Promise<QuizResult> {
        return await this.quizResultRepository.manager.save(quizResult);
    }

    async updateQuizResult(quizResult: QuizResult) {
        return await this.quizResultRepository.manager.update(QuizResult, { id: quizResult.id }, { rate: quizResult.rate });
    }

    async getQuizResultByField(field: keyof QuizResult, value: any): Promise<QuizResult> {
        return await this.quizResultRepository
            .createQueryBuilder('quiz_result')
            .where(`quiz_result.${field.toString()} = (:value)`, { value })
            .leftJoinAndSelect('quiz_result.attendedQuestions', 'attendedQuestions')
            .leftJoinAndSelect('attendedQuestions.userAnswers', 'userAnswers')
            .leftJoinAndSelect('userAnswers.answer', 'answer')
            .leftJoinAndSelect('attendedQuestions.questionInQuiz', 'questionInQuiz')
            .leftJoinAndSelect('questionInQuiz.question', 'question')
            .leftJoinAndSelect('questionInQuiz.quiz', 'quiz')
            .leftJoinAndSelect('quiz.subject', 'subject')
            .leftJoinAndSelect('quiz.type', 'type')
            .leftJoinAndSelect('question.answers', 'answers')
            .getOne();
    }

    async getQuizResultByAttendedQuestionId(id: string): Promise<QuizResult> {
        return await this.quizResultRepository
            .createQueryBuilder('quiz_result')
            .leftJoinAndSelect('quiz_result.attendedQuestions', 'attendedQuestions')
            .where('attendedQuestions.id = (:id)', { id })
            .leftJoinAndSelect('attendedQuestions.questionInQuiz', 'questionInQuiz')
            .leftJoinAndSelect('attendedQuestions.quizResult', 'quizResult')
            .leftJoinAndSelect('questionInQuiz.question', 'question')
            .leftJoinAndSelect('questionInQuiz.quiz', 'quiz')
            .getOne();
    }

    async getQuizResultByUserId(userId: string, subject: string, currentPage: number, pageSize: number): Promise<{ data: QuizResult[]; count: number }> {
        let quizResults, count;
        const query = this.quizResultRepository
            .createQueryBuilder('quiz_result')
            .leftJoinAndSelect('quiz_result.customer', 'customer')
            .leftJoinAndSelect('customer.user', 'user')
            .where('user.id = (:userId)', { userId })
            .leftJoinAndSelect('quiz_result.attendedQuestions', 'attendedQuestions')
            .leftJoinAndSelect('attendedQuestions.questionInQuiz', 'questionInQuiz')
            .leftJoinAndSelect('questionInQuiz.quiz', 'quiz')
            .leftJoinAndSelect('quiz.subject', 'subject')
            .andWhere('subject.id LIKE (:subjectId)', { subjectId: `%${subject}%` });

        try {
            quizResults = await query
                .leftJoinAndSelect('attendedQuestions.userAnswers', 'userAnswers')
                .leftJoinAndSelect('quiz.level', 'level')
                .orderBy('quiz_result.createdAt', 'DESC')
                .skip(currentPage * pageSize)
                .take(pageSize)
                .getMany();

            count = await query.getCount();
        } catch (err) {
            console.log(err);
            return { data: [], count: 0 };
        }
        return { data: quizResults, count };
    }
}
