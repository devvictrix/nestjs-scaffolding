import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

/**
 * A NestJS Pipe that attempts to JSON parse specific fields in the incoming request.
 */
@Injectable()
export class JsonStringToObjectPipe implements PipeTransform {
  /**
   * Initialize the pipe with fields to be parsed.
   * @param fields - An array of field names to be JSON parsed.
   */
  constructor(private readonly fields: string[]) {}

  /**
   * Perform JSON parsing on specified fields.
   * @param value - The incoming request object.
   * @returns The modified request object with parsed fields.
   */
  transform(value: Record<string, any>): Record<string, any> {
    // console.log('a');

    if (!value) {
      return value;
    }

    for (const field of this.fields) {
      try {
        if (typeof value[field] === 'string') {
          value[field] = JSON.parse(value[field]);
        } else if (typeof value[field] === 'object') {
          value[field] = value[field].map((v) => JSON.parse(v));
        }
      } catch (e) {
        throw new BadRequestException(
          `Invalid "${field}" field: must be a valid JSON string`,
        );
      }
    }

    return value;
  }
}
