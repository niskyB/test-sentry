import { DateService } from './date.service';
import { Module } from '@nestjs/common';

@Module({
    providers: [DateService],
    exports: [DateService],
})
export class DateModule {}
