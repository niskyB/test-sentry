import { AttendedQuestionRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';
import { AttendedQuestion } from '../core/models';

@Injectable()
export class AttendedQuestionService {
    constructor(private readonly attendedQuestionRepository: AttendedQuestionRepository) {}

    async getAttendedQuestionByQuizId(id: string): Promise<AttendedQuestion> {
        return await this.attendedQuestionRepository
            .createQueryBuilder('attended_question')
            .leftJoinAndSelect('attended_question.questionInQuiz', 'questionInQuiz')
            .leftJoinAndSelect('questionInQuiz.quiz', 'quiz')
            .where('quiz.id = (:id)', { id })
            .getOne();
    }

    async getAttendedQuestionByField(field: keyof AttendedQuestion, value: any): Promise<AttendedQuestion> {
        return await this.attendedQuestionRepository
            .createQueryBuilder('attended_question')
            .where(`attended_question.${field.toString()} = (:value)`, { value })
            .leftJoinAndSelect('attended_question.questionInQuiz', 'questionInQuiz')
            .leftJoinAndSelect('questionInQuiz.quiz', 'quiz')
            .getOne();
    }

    async saveAttendedQuestion(attendedQuestion: AttendedQuestion): Promise<AttendedQuestion> {
        return await this.attendedQuestionRepository.save(attendedQuestion);
    }
}
