import { Test, TestingModule } from '@nestjs/testing';
import { QuestionInQuizService } from '../question-in-quiz.service';

describe('QuestionInQuizService', () => {
    let service: QuestionInQuizService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [QuestionInQuizService],
        }).compile();

        service = module.get<QuestionInQuizService>(QuestionInQuizService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
