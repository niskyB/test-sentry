import { S3Module } from './../core/providers/s3/s3.module';
import { SubjectRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpertModule } from './../expert/expert.module';
import { Module } from '@nestjs/common';
import { SubjectController } from './subject.controller';
import { SubjectService } from './subject.service';

@Module({
    imports: [ExpertModule, TypeOrmModule.forFeature([SubjectRepository]), S3Module],
    controllers: [SubjectController],
    providers: [SubjectService],
})
export class SubjectModule {}
