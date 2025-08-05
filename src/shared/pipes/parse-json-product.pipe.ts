import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
@Injectable()
export class ParseJsonProductPipe implements PipeTransform {
  transform(value: any) {
    const fields = [
      'productTags',
      'productPackages',
      'productLocations',
      'includes',
      'excludes',
    ];

    // console.log('[ParseJsonProductPipe] forEach');
    fields.forEach((field) => {
      // console.log(field, value);
      this.parseJson(field, value);
    });

    return value;
  }

  private parseJson(fieldName: string, value: any) {
    if (typeof value[fieldName] === 'string') {
      try {
        value[fieldName] = JSON.parse(value[fieldName]);
      } catch (e) {
        throw new BadRequestException(
          `Invalid "${fieldName}" field: must be a valid JSON string`,
        );
      }
    }
  }
}
