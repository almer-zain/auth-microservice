import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
  Matches,
} from 'class-validator';

/*
|--------------------------------------------------------------------------
| Password
|--------------------------------------------------------------------------
| - Make sure confirm password, and password is the same.
*/

@ValidatorConstraint({ name: 'Match' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];

    return value === relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must match ${args.constraints[0]}`;
  }
}

export function Match(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}

/*
|--------------------------------------------------------------------------
| Username
|--------------------------------------------------------------------------
| - lowercase only
| - numbers allowed
| - . and _
| - no spaces
| - no double symbols
| - 8-32 chars
*/
export function IsValidUsername(validationOptions?: ValidationOptions) {
  return Matches(
    /^(?!.*[._]{2})[a-z0-9][a-z0-9._]{6,30}[a-z0-9]$/,
    {
      message:
        'Username must be 8-32 chars, lowercase, and may only contain letters, numbers, . or _',
      ...validationOptions,
    },
  );
}

/*
|--------------------------------------------------------------------------
| Display Name
|--------------------------------------------------------------------------
| - spaces allowed
| - uppercase allowed
| - cleaner for profiles
| - prevents weird spam chars
*/
export function IsDisplayName(
  validationOptions?: ValidationOptions,
) {
  return Matches(
    /^(?!.*\s{2})[a-zA-Z0-9](?:[a-zA-Z0-9 ]{0,30}[a-zA-Z0-9])?$/,
    {
      message:
        'Display name must be 1-32 chars and only contain letters, numbers, and spaces',
      ...validationOptions,
    },
  );
}