import { DimensionModule } from './../dimension/dimension.module';
import { S3Module } from '../core/providers/s3/s3.module';
import { QuestionRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';

@Module({
    imports: [TypeOrmModule.forFeature([QuestionRepository]), S3Module, DimensionModule],
    controllers: [QuestionController],
    providers: [QuestionService],
    exports: [QuestionService],
})
export class QuestionModule {}
