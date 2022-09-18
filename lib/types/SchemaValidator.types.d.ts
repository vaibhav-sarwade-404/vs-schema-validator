export declare type SchemaValidationErrorMessage = {
    type: string;
    properties: {
        [key: string]: string;
    };
};
export declare type SchemaError = {
    field: string;
    error: string;
};
export declare type PropetyType = "Undefined" | "Null" | "String" | "Boolean" | "Number" | "Array" | "Email" | "Object" | "Url" | "RegExp" | "Function";
export declare type ItemTypes = string[] | number[];
export declare type Properties = {
    /**
     * Type of property can be one of the PropetyType
     */
    type?: PropetyType;
    /**
     * Can property be null?
     */
    nullable?: boolean;
    /**
     * If property value is array then array type
     */
    items?: PropetyType[];
    /**
     * If property value is array and array elements needs to be from specific array
     */
    itemsFrom?: any[];
    /**
     * If property value only should be from specific array
     */
    oneOf?: any[];
    /**
     * If property value is required
     */
    required?: boolean;
    /**
     * Minimum length of value
     */
    minLength?: number;
    /**
     * Maximum length of value
     */
    maxLength?: number;
    /**
     * Minimum number of lowercase in value
     */
    minLowerCase?: number;
    /**
     * Minimum number of uppercase in value
     */
    minUpperCase?: number;
    /**
     * Minimum number of numbers in value
     */
    minNumbers?: number;
    /**
     * Minimum number of symbols in value
     */
    minSymbols?: number;
    /**
     * Maximum consecutive character in value
     */
    maxConsecutiveChars?: number;
    /**
     * If custom validator function is needed
     */
    validator?: (value: any) => string;
    /**
     * Error msg for field
     */
    errorMessage?: string;
};
/**
 * Schema
 */
export declare type Schema = {
    properties: {
        [key: string]: Properties | Schema;
    };
    type?: never;
    validator?: never;
    errorMessage?: never;
};
export declare type GenericObject = {
    [key: string]: any;
};
