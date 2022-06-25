import { UserAnswerRepository } from './../core/repositories';
import { Injectable } from '@nestjs/common';
import { UserAnswer } from '../core/models';

@Injectable()
export class UserAnswerService {
    constructor(private readonly userAnswerRepository: UserAnswerRepository) {}

    async saveUserAnswer(userAnswer: UserAnswer): Promise<UserAnswer> {
        return await this.userAnswerRepository.save(userAnswer);
    }
}
