import { Injectable, PipeTransform } from '@nestjs/common';
import { ObjectSchema, ValidationError } from 'joi';

@Injectable()
export class QueryJoiValidatorPipe implements PipeTransform {
    constructor(private readonly schema: ObjectSchema) {}

    private mapJoiError(error: ValidationError) {
        const errorObj = {};

        for (const item of error.details) errorObj[item.context.key] = item.message;
        return errorObj;
    }

    transform(input: any) {
        const { value } = this.schema.validate(input, { convert: true, stripUnknown: true });
        return value;
    }
}
