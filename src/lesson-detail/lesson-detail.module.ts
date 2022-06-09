import { LessonDetailRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { LessonDetailController } from './lesson-detail.controller';
import { LessonDetailService } from './lesson-detail.service';

@Module({
    imports: [TypeOrmModule.forFeature([LessonDetailRepository])],
    controllers: [LessonDetailController],
    providers: [LessonDetailService],
    exports: [LessonDetailService],
})
export class LessonDetailModule {}
