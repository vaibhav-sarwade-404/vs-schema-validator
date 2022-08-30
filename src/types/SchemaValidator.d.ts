export type SchemaValidationErrorMessage = {
  type: string;
  properties: {
    [key: string]: string;
  };
};

export type SchemaError = {
  field: string;
  error: string;
};

export type PropetyType =
  | "Undefined"
  | "Null"
  | "String"
  | "Boolean"
  | "Number"
  | "Array"
  | "Email"
  | "Object"
  | "Url";

export type ItemTypes = string[] | number[];

export type Properties = {
  type?: PropetyType;
  nullable?: boolean;
  items?: PropetyType;
  itemsFrom?: any[];
  oneOf?: any[];
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  minLowerCase?: number;
  minUpperCase?: number;
  minNumbers?: number;
  minSymbols?: number;
  maxConsecutiveChars?: number;
  validator?: Function;
  errorMessage?: string;
};

export type Schema = {
  properties: {
    [key: string]: Properties | Schema;
  };
  type?: never;
  validator?: never;
  errorMessage?: never;
};

export type GenericObject = {
  [key: string]: any;
};
