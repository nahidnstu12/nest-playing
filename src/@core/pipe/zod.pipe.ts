import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodIssue } from 'zod';

@Injectable()
export class ZodPipe implements PipeTransform {
  constructor(private readonly schema: any) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'query') {
      // Apply specific transformation to query parameters
    }
    const parsedValue = this.schema.safeParse(value);
    if (parsedValue.success) return parsedValue.data;
    throw new BadRequestException(
      parsedValue.error.flatten((issue: ZodIssue) => ({
        message: issue.message,
        errorCode: issue.code,
      })),
    );
  }
}
