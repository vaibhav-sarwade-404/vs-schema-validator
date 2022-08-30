import isEmail from "validator/lib/isEmail";
import { Logger } from "vs-logger";

import {
  GenericObject,
  Properties,
  PropetyType
} from "../types/SchemaValidator";

const fileName = "validations";

export const isValidEmail = (email: string) => {
  return isString(email) && isEmail(email);
};

export const isTypeMatches = (
  value: any,
  { type = "String" }: Properties
): boolean => {
  if (type === "Url") {
    return isValidUrl(value);
  }
  if (type === "Email") {
    return isValidEmail(value);
  }
  return Object.prototype.toString.call(value) === `[object ${type}]`;
};

export const isBoolean = (value: any): boolean =>
  isTypeMatches(value, { type: "Boolean" });
export const isObject = (value: any): boolean =>
  isTypeMatches(value, { type: "Object" });
export const isFunction = (value: any): boolean =>
  Object.prototype.toString.call(value) === `[object Function]`;
export const isString = (value: any): boolean =>
  isTypeMatches(value, { type: "String" });
export const isNumber = (value: any): boolean =>
  isTypeMatches(value, { type: "Number" });
export const isArray = (value: any): boolean =>
  isTypeMatches(value, { type: "String" });
export const isUndefined = (value: any): boolean =>
  isTypeMatches(value, { type: "Undefined" });
export const isNull = (value: any): boolean =>
  isTypeMatches(value, { type: "Null" });
export const isValidUrl = (url: any): boolean => {
  const log = new Logger(isValidUrl.name);
  try {
    new URL(url);
    return true;
  } catch (error) {
    log.info(
      `Provided URL is not URL or Something went wrong while checking URL with error: ${error}`
    );
  }
  return false;
};

export const isEmptyObject = (obj: object) =>
  JSON.stringify({}) === JSON.stringify(obj);

export const isNullable = (
  value: any,
  { nullable = false }: Properties
): boolean => {
  if (nullable) {
    return true;
  }
  if (isBoolean(value)) {
    return value;
  }
  if (isObject(value)) {
    return !isEmptyObject(value);
  }
  if (isNumber(value)) {
    return value > 0;
  }
  return !!value;
};

export const isItemsArray = (
  array: any[],
  { items = "String" }: Properties
): boolean => {
  if (!isArray(array)) {
    return false;
  }
  return array.every(arrayEle => isTypeMatches(arrayEle, { type: items }));
};

export const isArrayWithItemsFrom = (
  array: any[],
  { itemsFrom = [] }: Properties
): boolean => {
  if (!isArray(array)) {
    return false;
  }
  if (itemsFrom && !isArray(itemsFrom)) {
    return false;
  }
  const ele = array.findIndex((arrayEle: PropetyType) =>
    itemsFrom.includes(arrayEle)
  );
  return ele > -1;
};

export const isValueOneOfArray = (
  value: any,
  { oneOf = [] }: Properties
): boolean => {
  const ele = oneOf.findIndex(arrayEle => arrayEle === value);
  return ele > -1;
};

export const isRequired = (value: any) => {
  return isNullable(value, { required: false });
};

export const isPositiveNumber = (value: any) => {
  return isNumber(value) && value >= 0;
};

export const isMinLength = (value: any, { minLength = 0 }: Properties) => {
  const log = new Logger(`${isMinLength.name}`);
  if (isArray(value) || isString(value)) {
    return value.length >= minLength;
  }
  if (isNumber(value)) {
    return String(value).length >= minLength;
  }
  log.info(
    `${value} is of type which we cannot determine minLength. Please check validation schema`
  );
  return false;
};

export const isMaxLength = (value: any, { maxLength = 0 }: Properties) => {
  const log = new Logger(`${isMaxLength.name}`);
  if (isArray(value) || isString(value)) {
    return value.length <= maxLength;
  }
  if (isNumber(value)) {
    return String(value).length <= maxLength;
  }
  log.info(
    `${value} is of type which we cannot determine maxLength. Please check validation schema`
  );
  return false;
};

export const isMinLowerCase = (
  value: any,
  { minLowerCase = 0 }: Properties
) => {
  const log = new Logger(`${isMinLowerCase.name}`);
  if (isString(value)) {
    return ((value || "").match(/[a-z]/g) || []).length >= minLowerCase;
  }
  log.info(
    `${value} is of type which we cannot find lower cases. Please check validation schema`
  );
  return false;
};

export const isMinUpperCase = (
  value: any,
  { minUpperCase = 0 }: Properties
) => {
  const log = new Logger(`${isMinUpperCase.name}`);
  if (isString(value)) {
    return ((value || "").match(/[A-Z]/g) || []).length >= minUpperCase;
  }
  log.info(
    `${value} is of type which we cannot find lower cases. Please check validation schema`
  );
  return false;
};

export const isMinNumbers = (value: any, { minNumbers = 0 }: Properties) => {
  const log = new Logger(`${isMinNumbers.name}`);
  if (isString(value) || isNumber(value)) {
    return (
      ((value || String(value || "")).match(/\d/g) || []).length >= minNumbers
    );
  }
  log.info(
    `${value} is of type which we cannot find numbers. Please check validation schema`
  );
  return false;
};

export const isMinSymbols = (value: any, { minSymbols = 0 }: Properties) => {
  const log = new Logger(`${isMinSymbols.name}`);
  if (isString(value)) {
    return (value.match(/[^\p{L}\d\s]/u) || []).length >= minSymbols;
  }
  log.info(
    `${value} is of type which we cannot find symbols. Please check validation schema`
  );
  return false;
};

export const isMaxConsecutiveCharsExceed = (
  value: any,
  { maxConsecutiveChars = 0 }: Properties
) => {
  const log = new Logger(`${isMinSymbols.name}`);
  if (isString(value)) {
    const charCountMap: GenericObject = {};
    const valueArray: string[] = Array.from(value);
    valueArray.forEach(char => {
      char = String(char).toLocaleLowerCase();
      const val = charCountMap[char];
      if (val) {
        charCountMap[char] += 1;
      } else {
        charCountMap[char] = 1;
      }
    });
    return !Object.values(charCountMap).find(
      charCount => charCount > maxConsecutiveChars
    );
  }
  log.info(
    `${value} is of type which we cannot find consecutive characters. Please check validation schema`
  );
  return false;
};

export const validate = (
  propertyKey: string,
  value: any,
  validators: Function[],
  validationRule: Properties
) => {
  const log = new Logger(`${fileName}.${validate.name}`);
  log.debug(`validating for ${propertyKey} with value as ${value}`);
  let isValid = true;
  for (const validationFunction of validators) {
    if (isFunction(validationFunction)) {
      isValid = validationFunction(value, validationRule);
      log.debug(
        `validation function (${validationFunction.name}) result: ${isValid}`
      );
      if (!isValid) {
        break;
      }
    } else {
      log.info(
        `${validationFunction} is not a function, skipping this validation function`
      );
    }
  }
  log.debug(
    `validation complete, value for ${propertyKey} is ${
      isValid ? "valid" : "invalid"
    }`
  );
  return isValid;
};

export default {
  isBoolean,
  isObject,
  isString,
  isNumber,
  isNullable,
  isEmptyObject,
  isTypeMatches,
  isItemsArray,
  isArrayWithItemsFrom,
  validate,
  isValueOneOfArray,
  isRequired,
  isMinLength,
  isMaxLength,
  isMinLowerCase,
  isMinUpperCase,
  isMinNumbers,
  isMinSymbols,
  isMaxConsecutiveCharsExceed
};
