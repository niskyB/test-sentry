import { LessonRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';

@Module({
    imports: [TypeOrmModule.forFeature([LessonRepository])],
    controllers: [LessonController],
    providers: [LessonService],
    exports: [LessonService],
})
export class LessonModule {}
