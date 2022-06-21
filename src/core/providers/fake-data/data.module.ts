import { DataService } from './data.service';
import { Module } from '@nestjs/common';

@Module({
    providers: [DataService],
    exports: [DataService],
})
export class DataModule {}
