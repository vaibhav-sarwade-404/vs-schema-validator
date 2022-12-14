import { Properties } from "../types/SchemaValidator.types";
export declare const isValidEmail: (email: string) => boolean;
export declare const isTypeMatches: (value: any, { type }: Properties) => boolean;
export declare const isBoolean: (value: any) => boolean;
export declare const isObject: (value: any) => boolean;
export declare const isFunction: (value: any) => boolean;
export declare const isString: (value: any) => boolean;
export declare const isNumber: (value: any) => boolean;
export declare const isArray: (value: any) => boolean;
export declare const isUndefined: (value: any) => boolean;
export declare const isNull: (value: any) => boolean;
export declare const isValidUrl: (url: any) => boolean;
export declare const isEmptyObject: (obj: object) => boolean;
export declare const isNullable: (value: any, { nullable }: Properties) => boolean;
export declare const isItemsArray: (array: any[], { items }: Properties) => boolean;
export declare const isArrayWithItemsFrom: (array: any[], { itemsFrom }: Properties) => boolean;
export declare const isValueOneOfArray: (value: any, { oneOf }: Properties) => boolean;
export declare const isRequired: (value: any) => boolean;
export declare const isPositiveNumber: (value: any) => boolean;
export declare const isMinLength: (value: any, { minLength }: Properties) => boolean;
export declare const isMaxLength: (value: any, { maxLength }: Properties) => boolean;
export declare const isMinLowerCase: (value: any, { minLowerCase }: Properties) => boolean;
export declare const isMinUpperCase: (value: any, { minUpperCase }: Properties) => boolean;
export declare const isMinNumbers: (value: any, { minNumbers }: Properties) => boolean;
export declare const isMinSymbols: (value: any, { minSymbols }: Properties) => boolean;
export declare const isMaxConsecutiveCharsExceed: (value: any, { maxConsecutiveChars }: Properties) => boolean;
export declare const validate: (propertyKey: string, value: any, validators: Function[], validationRule: Properties) => boolean;
declare const _default: {
    isBoolean: (value: any) => boolean;
    isObject: (value: any) => boolean;
    isString: (value: any) => boolean;
    isNumber: (value: any) => boolean;
    isNullable: (value: any, { nullable }: Properties) => boolean;
    isEmptyObject: (obj: object) => boolean;
    isTypeMatches: (value: any, { type }: Properties) => boolean;
    isItemsArray: (array: any[], { items }: Properties) => boolean;
    isArrayWithItemsFrom: (array: any[], { itemsFrom }: Properties) => boolean;
    validate: (propertyKey: string, value: any, validators: Function[], validationRule: Properties) => boolean;
    isValueOneOfArray: (value: any, { oneOf }: Properties) => boolean;
    isRequired: (value: any) => boolean;
    isMinLength: (value: any, { minLength }: Properties) => boolean;
    isMaxLength: (value: any, { maxLength }: Properties) => boolean;
    isMinLowerCase: (value: any, { minLowerCase }: Properties) => boolean;
    isMinUpperCase: (value: any, { minUpperCase }: Properties) => boolean;
    isMinNumbers: (value: any, { minNumbers }: Properties) => boolean;
    isMinSymbols: (value: any, { minSymbols }: Properties) => boolean;
    isMaxConsecutiveCharsExceed: (value: any, { maxConsecutiveChars }: Properties) => boolean;
};
export default _default;
