import { SubjectCategoryModule } from './../subject-category/subject-category.module';
import { UserModule } from './../user/user.module';
import { AuthModule } from './../auth/auth.module';
import { S3Module } from './../core/providers/s3/s3.module';
import { SubjectRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpertModule } from './../expert/expert.module';
import { Module } from '@nestjs/common';
import { SubjectController } from './subject.controller';
import { SubjectService } from './subject.service';

@Module({
    imports: [ExpertModule, TypeOrmModule.forFeature([SubjectRepository]), S3Module, AuthModule, UserModule, SubjectCategoryModule],
    controllers: [SubjectController],
    providers: [SubjectService],
    exports: [SubjectService],
})
export class SubjectModule {}
