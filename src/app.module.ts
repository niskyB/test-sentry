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
import { SubjectCategoryService } from './subject-category/subject-category.service';
import { SubjectCategoryController } from './subject-category/subject-category.controller';
import { SubjectCategoryModule } from './subject-category/subject-category.module';
import { DimensionModule } from './dimension/dimension.module';
import { DimensionTypeModule } from './dimension-type/dimension-type.module';
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
    ],
    providers: [SubjectCategoryService],
    controllers: [SubjectCategoryController],
})
export class AppModule {}
