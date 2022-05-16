import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './module.config';
import { SliderModule } from './slider/slider.module';

@Module({
    imports: [DbModule, UserModule, AuthModule, SliderModule],
})
export class AppModule {}
