import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class DateService {
    calculateValidTo = (validFrom: string, duration: number) => {
        return moment(validFrom).month(duration).toDate().toISOString();
    };

    calculateNDaysBack = (n: number): Array<string> => {
        const result: Array<string> = [];
        const today = new Date();
        result.push(today.toISOString().slice(0, 10));
        for (let i = 1; i < n; i++) {
            today.setDate(today.getDate() - 1);
            result.push(today.toISOString().slice(0, 10));
        }
        return result;
    };

    calculateDaysBetween = (from: string, to: string): Array<string> => {
        const result: Array<string> = [];
        const fromDate = new Date(from);
        const toDate = new Date(to);
        result.push(fromDate.toISOString().slice(0, 10));
        while (fromDate.toISOString().slice(0, 10) !== toDate.toISOString().slice(0, 10)) {
            fromDate.setDate(fromDate.getDate() + 1);
            result.push(fromDate.toISOString().slice(0, 10));
        }
        result.push(toDate.toISOString().slice(0, 10));
        return result;
    };
}
