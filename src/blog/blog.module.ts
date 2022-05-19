import { S3Module } from 'src/core/providers/s3/s3.module';
import { MarketingModule } from './../marketing/marketing.module';
import { UserModule } from './../user/user.module';
import { AuthModule } from './../auth/auth.module';
import { BlogRepository } from './../core/repositories';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';

@Module({
    imports: [TypeOrmModule.forFeature([BlogRepository]), AuthModule, UserModule, MarketingModule, S3Module],
    controllers: [BlogController],
    providers: [BlogService],
    exports: [BlogService],
})
export class BlogModule {}
