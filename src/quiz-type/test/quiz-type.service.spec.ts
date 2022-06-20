import { Test, TestingModule } from '@nestjs/testing';
import { QuizTypeService } from '../quiz-type.service';

describe('QuizTypeService', () => {
    let service: QuizTypeService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [QuizTypeService],
        }).compile();

        service = module.get<QuizTypeService>(QuizTypeService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
