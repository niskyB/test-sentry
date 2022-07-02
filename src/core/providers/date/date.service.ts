import { Injectable } from '@nestjs/common';
import moment from 'moment';

@Injectable()
export class DateService {
    calculateValidTo = (validFrom: string, duration: number) => {
        return moment(validFrom).month(duration).toDate().toISOString();
    };

    calculateNDaysBack = (n: number): Array<string> => {
        const result: Array<string> = [];
        const today = new Date();
        result.push(today.toISOString());
        for (let i = 1; i < n; i++) {
            today.setDate(today.getDate() - 1);
            result.push(today.toISOString());
        }
        return result;
    };
}
