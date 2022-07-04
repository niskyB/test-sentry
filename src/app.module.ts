import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './module.config';
import { SliderModule } from './slider/slider.module';
import { join } from 'path';
import { CustomerModule } from './customer/customer.module';
import { MarketingModule } from './marketing/marketing.module';
import { BlogModule } from './blog/blog.module';
import { BlogCategoryModule } from './blog-category/blog-category.module';
import { AdminModule } from './admin/admin.module';
import { SaleModule } from './sale/sale.module';
import { ExpertModule } from './expert/expert.module';
import { SubjectModule } from './subject/subject.module';
import { SubjectCategoryModule } from './subject-category/subject-category.module';
import { DimensionModule } from './dimension/dimension.module';
import { DimensionTypeModule } from './dimension-type/dimension-type.module';
import { PricePackageModule } from './price-package/price-package.module';
import { LessonModule } from './lesson/lesson.module';
import { LessonTypeModule } from './lesson-type/lesson-type.module';
import { LessonQuizModule } from './lesson-quiz/lesson-quiz.module';
import { LessonDetailModule } from './lesson-detail/lesson-detail.module';
import { SubjectTopicModule } from './subject-topic/subject-topic.module';
import { QuizModule } from './quiz/quiz.module';
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';
import { RegistrationModule } from './registration/registration.module';
import { QuizResultModule } from './quiz-result/quiz-result.module';
import { UserAnswerModule } from './user-answer/user-answer.module';
import { QuestionInQuizModule } from './question-in-quiz/question-in-quiz.module';
import { AttendedQuestionModule } from './attended-question/attended-question.module';
import { QuestionLevelModule } from './question-level/question-level.module';
import { QuizTypeModule } from './quiz-type/quiz-type.module';
import { ExamLevelModule } from './exam-level/exam-level.module';
import { QuizDetailModule } from './quiz-detail/quiz-detail.module';
import { RoleModule } from './role/role.module';
import { SystemMenuModule } from './system-menu/system-menu.module';
import { TransactionModule } from './transaction/transaction.module';
@Module({
    imports: [
        DbModule,
        UserModule,
        AuthModule,
        SliderModule,
        // -- serve static folder
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'uploads'),
        }),
        CustomerModule,
        MarketingModule,
        BlogModule,
        BlogCategoryModule,
        AdminModule,
        SaleModule,
        ExpertModule,
        SubjectModule,
        SubjectCategoryModule,
        DimensionModule,
        DimensionTypeModule,
        PricePackageModule,
        LessonModule,
        LessonTypeModule,
        LessonQuizModule,
        LessonDetailModule,
        SubjectTopicModule,
        QuizModule,
        QuestionModule,
        AnswerModule,
        RegistrationModule,
        QuizResultModule,
        UserAnswerModule,
        QuestionInQuizModule,
        AttendedQuestionModule,
        QuestionLevelModule,
        QuizTypeModule,
        ExamLevelModule,
        QuizDetailModule,
        RoleModule,
        SystemMenuModule,
        TransactionModule,
    ],
})
export class AppModule {}
