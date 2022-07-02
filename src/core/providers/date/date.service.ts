import { Injectable } from '@nestjs/common';
import moment from 'moment';

@Injectable()
export class DateService {
    calculateValidTo = (validFrom: string, duration: number) => {
        return moment(validFrom).month(duration).toDate().toISOString();
    };
}
