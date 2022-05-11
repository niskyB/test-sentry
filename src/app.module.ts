import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './module.config';

@Module({
    imports: [DbModule, UserModule, AuthModule],
})
export class AppModule {}
