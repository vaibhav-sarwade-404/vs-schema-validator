import { Logger } from "@vs-org/logger";

import {
  GenericObject,
  Properties,
  Schema,
  SchemaError
} from "./types/SchemaValidator.types";
import genericUtils from "./utils/genericUtils";
import validations, {
  isEmptyObject,
  isFunction,
  isObject
} from "./utils/validations";

export class SchemaValidationError {
  private errors: SchemaError[];
  constructor() {
    this.errors = [] as SchemaError[];
  }

  public addError(error: SchemaError) {
    this.errors.push(error);
  }

  public addErrors(errors: SchemaError[]) {
    this.errors = [...this.errors, ...errors];
  }

  public getErrors(): SchemaError[] {
    return this.errors;
  }

  public hasSchemaValidationError(): boolean {
    return !!this.errors.length;
  }
}

const logger = Logger.getInstance("info");

export class SchemaValidator {
  private allErrors: boolean;
  private schemas: { [key: string]: Schema };
  private compiledSchemas: { [key: string]: Schema };
  private static instance: SchemaValidator;
  private constructor({ allErrors }: { allErrors: boolean }) {
    this.allErrors = allErrors;
    this.schemas = {};
    this.compiledSchemas = {};
  }

  public static getInstance({
    allErrors
  }: {
    allErrors?: boolean;
  }): SchemaValidator {
    if (!SchemaValidator.instance) {
      SchemaValidator.instance = new SchemaValidator({
        allErrors: !!allErrors
      });
    }

    return SchemaValidator.instance;
  }

  public addSchema(name: string, schema: Schema) {
    this.schemas[name] = schema;
  }

  public validate(
    name: string,
    object: { [key: string]: any }
  ): SchemaValidationError {
    const log = logger.getLogger(`${SchemaValidator.name}.validate`);
    log.info(`validating object against schema(${name})`);
    let schemaValidationError = new SchemaValidationError();

    if (!isObject(object)) {
      schemaValidationError.addError({
        field: "payload",
        error: `Payload(${name.split(".").pop()}) should be valid object`
      });
      return schemaValidationError;
    }
    for (const property of Object.keys(this.schemas[name].properties)) {
      const {
        required = false,
        type = "String",
        validator
      }: Properties = this.schemas[name].properties[property];
      if (!(property in object) && !required) {
        continue;
      }
      if (type === "Object") {
        const validationResult = this.validate(
          `${name}.${property}`,
          genericUtils.getValueFromObject(object, property)
        );
        if (validationResult.hasSchemaValidationError()) {
          schemaValidationError.addErrors(validationResult.getErrors());
        }
        continue;
      }
      if (validator && isFunction(validator)) {
        const validationMsg = validator(
          genericUtils.getValueFromObject(object, property)
        );
        if (validationMsg) {
          schemaValidationError.addError({
            field: property,
            error: validationMsg
          });
          if (!this.allErrors) {
            break;
          }
        }
      }
    }
    return schemaValidationError;
  }

  /**
   * Returns validate function which will take object as parameter to validate
   */
  public compile(name: string, _schema?: Schema): Function {
    const log = logger.getLogger(`${SchemaValidator.name}.compile`);
    log.info(`compiling schema validation for schema(${name})`);
    if (
      (this.schemas[name] && !isObject(_schema)) ||
      (_schema && isObject(_schema))
    ) {
      log.debug(
        `schema was provided to compile function, adding schema to collection, if already exist it will be with new schema`
      );
      _schema && this.addSchema(name, _schema);
    } else {
      log.error(
        `compilation of schema(${name}) failed because no schema is not an object, skipping compilation`
      );
      return () => {};
    }
    const schema: Schema = this.schemas[name];
    if (!schema) {
      log.error(
        `compilation of schema(${name}) failed because no schema found, skipping compilation`
      );
      return () => {};
    }
    if (isEmptyObject(schema)) {
      return (value: GenericObject) => {
        return this.validate(name, value);
      };
    }

    for (const property of Object.keys(schema.properties)) {
      const {
        nullable,
        items,
        itemsFrom,
        oneOf,
        required,
        minLength,
        maxLength,
        minLowerCase,
        minUpperCase,
        minNumbers,
        minSymbols,
        maxConsecutiveChars,
        validator
      }: Properties = schema.properties[property];

      //Nested schema add recursive function
      let validators = [] as Function[];
      validators.push(validations.isTypeMatches);

      //Nullable validation
      if (!nullable) {
        validators.push(validations.isNullable);
      }
      //Items validation
      if (items) {
        validators.push(validations.isItemsArray);
      }
      //ItemsFrom validation
      if (itemsFrom) {
        validators.push(validations.isArrayWithItemsFrom);
      }
      //Oneof validation
      if (oneOf) {
        validators.push(validations.isValueOneOfArray);
      }
      //Required validation
      if (required) {
        validators.push(validations.isRequired);
      }
      //minLength validation
      if (minLength) {
        validators.push(validations.isMinLength);
      }
      //maxLength validation
      if (maxLength) {
        validators.push(validations.isMaxLength);
      }
      //minLowercase validation
      if (minLowerCase) {
        validators.push(validations.isMinLowerCase);
      }
      //minUppercase validation
      if (minUpperCase) {
        validators.push(validations.isMinUpperCase);
      }
      //minUppercase validation
      if (minNumbers) {
        validators.push(validations.isMinUpperCase);
      }

      //minSymbols validation
      if (minSymbols) {
        validators.push(validations.isMinSymbols);
      }

      //maxConsecutiveChars validation
      if (maxConsecutiveChars) {
        validators.push(validations.isMaxConsecutiveCharsExceed);
      }

      //Custom validation
      if (validator && isFunction(validator)) {
        log.info(
          `Schema has custom validator function, please note custom functions should return true or false as result in any case. True for successful validation, and false for failed validation`
        );
        validators.push(validator);
        continue;
      }
      schema.properties[property].validator = (value: any): string => {
        log.debug(`Validating for property ${property}`);
        const isValid = validations.validate(
          property,
          value,
          validators,
          schema.properties[property]
        );
        log.debug(`Validation result for property ${property} : ${isValid}`);
        if (isValid) {
          return "";
        }
        return (
          schema.properties[property].errorMessage || `${property} is not valid`
        );
      };
    }
    this.compiledSchemas[name] = schema;
    log.info(`compiled schema validation for schema(${name})`);
    return (value: GenericObject) => {
      return this.validate(name, value);
    };
  }
}
