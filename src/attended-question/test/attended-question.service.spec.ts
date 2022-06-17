import { Test, TestingModule } from '@nestjs/testing';
import { AttendedQuestionService } from '../attended-question.service';

describe('AttendedQuestionService', () => {
    let service: AttendedQuestionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AttendedQuestionService],
        }).compile();

        service = module.get<AttendedQuestionService>(AttendedQuestionService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
