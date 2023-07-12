import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsShortField(validationOptions?: ValidationOptions) {
return function (object: Record<string, any>, propertyName: string) {
	registerDecorator({
		name: 'IsShortField',
		target: object.constructor,
		propertyName: propertyName,
		constraints: [],
		options: validationOptions,
		validator: {
			validate(value: any) {
			return typeof value === 'string' && value.length <= 20;
			},
		},
	});
};
}

export function IsLongField(validationOptions?: ValidationOptions) {
return function (object: Record<string, any>, propertyName: string) {
	registerDecorator({
		name: 'IsLongField',
		target: object.constructor,
		propertyName: propertyName,
		constraints: [],
		options: validationOptions,
		validator: {
			validate(value: any) {
			return typeof value === 'string' && value.length <= 1024;
			},
		},
	});
};
}