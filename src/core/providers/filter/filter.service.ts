import { Injectable } from '@nestjs/common';

@Injectable()
export class FilterService {
    public getMinMaxValue(value: boolean) {
        if (value === false)
            return {
                minValue: 0,
                maxValue: 0,
            };
        if (value === true)
            return {
                minValue: 1,
                maxValue: 1,
            };
        if (value === null)
            return {
                minValue: 0,
                maxValue: 1,
            };
    }
}
