import { Test, TestingModule } from '@nestjs/testing';
import { QuizDetailService } from '../quiz-detail.service';

describe('QuizDetailService', () => {
    let service: QuizDetailService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [QuizDetailService],
        }).compile();

        service = module.get<QuizDetailService>(QuizDetailService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
