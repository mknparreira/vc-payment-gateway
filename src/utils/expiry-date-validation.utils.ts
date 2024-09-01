import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidExpiryDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidExpiryDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) return false;

          const [month, year] = value
            .split('/')
            .map((part: string) => parseInt(part, 10));

          if (month < 1 || month > 12) return false;

          const currentYear = new Date().getFullYear() % 100;
          const currentMonth = new Date().getMonth() + 1;

          if (
            year < currentYear ||
            (year === currentYear && month < currentMonth)
          ) {
            return false;
          }

          return true;
        },
      },
    });
  };
}
