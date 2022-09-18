# @vs-org/schema-validator

This is basic JSON schema validator.

## Usage

1. Basic schema validation

```
// CJS
import { SchemaValidationError, SchemaValidator } from "@vs-org/schema-validator";
import { Schema } from "@vs-org/schema-validator/SchemaValidator";

// Module
const SchemaValidator = require("@vs-org/schema-validator").default;


const schemaValidator = SchemaValidator.getInstance({
  allErrors: true
});

const validationSchema: Schema = {
  properties: {
    firstName: {
      type: "String",
      required: true,
      maxLength: 30
    },
    lastName: {
      type: "String",
      required: false,
      minLength: 30
    },
    email: {
      type: "Email",
      required: true
    },
    password: {
      type: "String",
      required: true,
      minLength: 8,
      maxLength: 48,
      maxConsecutiveChars: 2,
      minUpperCase: 1,
      minNumbers: 1,
      minSymbols: 1,
      errorMessage:
        "Password is invalid. Should contain min 8 character, max 48 characters, no consecutive characters, atleast one number, atleast one symbol, atleast one uppercase character"
    }
  }
};

schemaValidator.addSchema("test", validationSchema);
schemaValidator.compile("test");

const validationErrors: SchemaValidationError = schemaValidator.validate(
  "test",
  {
    firstName: "asd",
    email: "asd@asd.com",
    password: "PassS@123"
  }
);
```

<br/>

2. Custom validation function

```
// CJS
import { SchemaValidationError, SchemaValidator } from "@vs-org/schema-validator";
import { Schema } from "@vs-org/schema-validator/SchemaValidator";

// Module
const SchemaValidator = require("@vs-org/schema-validator").default;

const schemaValidator = SchemaValidator.getInstance({
  allErrors: true
});

const isValidEmail = (email) => {
  if(email === 'test@test.com'){
    return `Provided email is invalid`
  }
  return '';
}

const validationSchema: Schema = {
  properties: {
    firstName: {
      type: "String",
      required: true,
      maxLength: 30
    },
    lastName: {
      type: "String",
      required: false,
      minLength: 30
    },
    email: {
      type: "Email",
      required: true,
      validator: isValidEmail
    }
  }
};

schemaValidator.addSchema("test", validationSchema);
schemaValidator.compile("test");

const validationErrors: SchemaValidationError = schemaValidator.validate(
  "test",
  {
    firstName: "asd",
    email: "test@test.com"
  }
);

// Result
SchemaValidationError {
      errors: [ { field: 'email', error: 'Provided email is invalid' } ]
    }
```

<br/>

## Schema validator options

| option      | required | type      | Description                                                                                                                                                                                                                                                                     |
| ----------- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allErrors` | `false`  | `boolean` | If all schema validator errors are required, then provide this option for `getInstance` function. If this is not specified, Vs Schema validator will first occurance of validation error. Ideally it is recommeded to use this as user will get all errors together to correct. |

<br/>

## Property options

| option                | required | type                                                                                                                                                              | Description                                                                                                                                                                                                                                                                            |
| --------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`                | `false`  | `PropetyType ("Undefined", "Null", "String", "Boolean", "Number", "Array", "Email", "Object", "Url", "RegExp", "Function")`                                       | This option indicate what type of value is accepted for the property                                                                                                                                                                                                                   |
| `nullable`            | `false`  | `boolean`                                                                                                                                                         | This option indicate if value canb be null for the property                                                                                                                                                                                                                            |
| `items`               | `false`  | `PropertyType[] Array can contain values only from ("Undefined", "Null", "String", "Boolean", "Number", "Array", "Email", "Object", "Url", "RegExp", "Function")` | This option is used to validate array of types                                                                                                                                                                                                                                         |
| `itemsFrom`           | `false`  | `any[] `                                                                                                                                                          | This option is used to validate value array items should be from `itemsFrom` array                                                                                                                                                                                                     |
| `oneOf`               | `false`  | `any[] `                                                                                                                                                          | This option is used to validate value should be one of item from `oneOf` array                                                                                                                                                                                                         |
| `required`            | `false`  | `boolean`                                                                                                                                                         | This option indicates if value should be `truthy`                                                                                                                                                                                                                                      |
| `minLength`           | `false`  | `number`                                                                                                                                                          | This option indicates value should be of at least minimum length. Value can be array, string, number                                                                                                                                                                                   |
| `maxLength`           | `false`  | `number`                                                                                                                                                          | This option indicates value can be of maximum length. Value can be array, string, number                                                                                                                                                                                               |
| `minLowerCase`        | `false`  | `number`                                                                                                                                                          | This option indicates value should atleast contain minimun lowercase chars                                                                                                                                                                                                             |
| `minUpperCase`        | `false`  | `number`                                                                                                                                                          | This option indicates value should atleast contain minimun uppercase chars                                                                                                                                                                                                             |
| `minNumbers`          | `false`  | `number`                                                                                                                                                          | This option indicates value should atleast contain minimun numbers (digits)                                                                                                                                                                                                            |
| `minSymbols`          | `false`  | `number`                                                                                                                                                          | This option indicates value should atleast contain minimun symbols                                                                                                                                                                                                                     |
| `maxConsecutiveChars` | `false`  | `number`                                                                                                                                                          | This option indicates value can contain maximum consecutive chars                                                                                                                                                                                                                      |
| `validator`           | `false`  | `Function: (value: any) => string`                                                                                                                                | If application needs some custom validation, then option can be provided. It should be function which can accept any type of value and should always return string (error message) which will be used as validation error message. If provided value is valid then return empty string |
| `errorMessage`        | `false`  | `string`                                                                                                                                                          | This option can be provided if custom error messages are required.                                                                                                                                                                                                                     |

<br/>

## License

MIT (see [LICENSE](https://github.com/vaibhav-sarwade-404/vs-schema-validator/blob/main/LICENSE))

<br/>

## Note

This is experimental package and not actively maintained. Please don't raise issues or feature requests. Only use for development and POC's.
