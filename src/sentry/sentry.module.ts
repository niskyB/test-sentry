import { Module } from '@nestjs/common';
import { SentryService } from './sentry.service';
import * as Sentry from '@sentry/node';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SentryInterceptor } from './sentry.interceptor';
import { config } from 'src/core';
import { SentryController } from './sentry.controller';

export const SENTRY_OPTIONS = 'SENTRY_OPTIONS';

@Module({
    providers: [SentryService],
})
export class SentryModule {
    static forRoot() {
        const options = {
            dsn: config.SENTRY_DSN,
            tracesSampleRate: 1.0,
            debug: true,
        };
        Sentry.init(options);

        return {
            module: SentryModule,
            controllers: [SentryController],
            providers: [
                {
                    provide: SENTRY_OPTIONS,
                    useValue: options,
                },
                SentryService,
                {
                    provide: APP_INTERCEPTOR,
                    useClass: SentryInterceptor,
                },
            ],
            exports: [SentryService],
        };
    }
}
