import { BadRequestException } from '@nestjs/common';
import { ValidationOptions, registerDecorator } from 'class-validator';
import { validateLanguage } from './language-validation';

export function IsLocaleLanguage(
  options?: ValidationOptions,
): PropertyDecorator {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(value) {
          // console.log(validateLanguage(value));
          if (!validateLanguage(value)) {
            // console.log('not pass');
            console.log(value);
            throw new BadRequestException('Invalid Language.');
          }
          // console.log('pass');
          return value;
        },
      },
    });
  };
}
