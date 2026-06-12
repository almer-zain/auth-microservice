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
  // Use 'unknown' instead of 'any'
  validate(value: unknown, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints as string[];
    // Cast object to Record to avoid unsafe member access
    const object = args.object as Record<string, unknown>;
    const relatedValue = object[relatedPropertyName];

    return value === relatedValue;
  }

  defaultMessage(args: ValidationArguments): string {
    const [relatedPropertyName] = args.constraints as string[];
    return `${args.property} must match ${relatedPropertyName}`;
  }
}

export function Match(property: string, validationOptions?: ValidationOptions) {
  // Use 'object' instead of 'any' for the target
  return (object: object, propertyName: string): void => {
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
export function IsValidUsername(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return Matches(/^(?!.*[._]{2})[a-z0-9][a-z0-9._]{6,30}[a-z0-9]$/, {
    message:
      'Username must be 8-32 chars, lowercase, and may only contain letters, numbers, . or _',
    ...validationOptions,
  });
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
): PropertyDecorator {
  return Matches(/^(?!.*\s{2})[a-zA-Z0-9](?:[a-zA-Z0-9 ]{0,30}[a-zA-Z0-9])?$/, {
    message:
      'Display name must be 1-32 chars and only contain letters, numbers, and spaces',
    ...validationOptions,
  });
}
