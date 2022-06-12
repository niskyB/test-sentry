import { LessonDetail } from './../core/models';
import { LessonDetailRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { LessonDetailController } from './lesson-detail.controller';
import { LessonDetailService } from './lesson-detail.service';
import { Connection } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([LessonDetail])],
    controllers: [LessonDetailController],
    providers: [LessonDetailService, { provide: LessonDetailRepository, useFactory: (connection: Connection) => connection.getCustomRepository(LessonDetailRepository), inject: [Connection] }],
    exports: [LessonDetailService],
})
export class LessonDetailModule {}
