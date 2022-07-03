import { SubjectCategory } from './../core/models';
import { UserModule } from './../user/user.module';
import { AuthModule } from './../auth/auth.module';
import { SubjectCategoryService } from './subject-category.service';
import { SubjectCategoryController } from './subject-category.controller';
import { SubjectCategoryRepository } from './../core/repositories/subjectCategory.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { SubjectCategoriesController } from './subject-categories.controller';
import { Connection } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([SubjectCategory]), AuthModule, forwardRef(() => UserModule)],
    controllers: [SubjectCategoryController, SubjectCategoriesController],
    providers: [
        SubjectCategoryService,
        { provide: SubjectCategoryRepository, useFactory: (connection: Connection) => connection.getCustomRepository(SubjectCategoryRepository), inject: [Connection] },
    ],
    exports: [SubjectCategoryService],
})
export class SubjectCategoryModule {}
