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
    ],
})
export class AppModule {}
