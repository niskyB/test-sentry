import { SubjectCategoryService } from './subject-category.service';
import { SubjectCategoryController } from './subject-category.controller';
import { SubjectCategoryRepository } from './../core/repositories/subjectCategory.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
    imports: [TypeOrmModule.forFeature([SubjectCategoryRepository])],
    controllers: [SubjectCategoryController],
    providers: [SubjectCategoryService],
    exports: [SubjectCategoryService],
})
export class SubjectCategoryModule {}
