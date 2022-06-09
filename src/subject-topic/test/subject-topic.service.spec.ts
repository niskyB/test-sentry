import { Test, TestingModule } from '@nestjs/testing';
import { SubjectTopicService } from '../subject-topic.service';

describe('SubjectTopicService', () => {
    let service: SubjectTopicService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SubjectTopicService],
        }).compile();

        service = module.get<SubjectTopicService>(SubjectTopicService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
