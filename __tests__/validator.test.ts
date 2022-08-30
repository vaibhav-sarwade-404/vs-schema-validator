import { Schema } from "../src/types/SchemaValidator";

import { SchemaValidationError, SchemaValidator } from "../src/schemaValidator";

describe("Validation", () => {
  const schemaValidator = SchemaValidator.getInstance({
    allErrors: true
  });
  beforeAll(() => {
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
  });

  test("Validation should fail", () => {
    const validationErrors: SchemaValidationError = schemaValidator.validate(
      "test",
      {
        firstName: "asd",
        email: "asd@asd.com",
        password: "PassS@123"
      }
    );
    expect(validationErrors && !!validationErrors.getErrors().length).toBe(
      true
    );
  });

  test("Validation should pass", () => {
    const validationErrors: SchemaValidationError = schemaValidator.validate(
      "test",
      {
        firstName: "asd",
        email: "asd@asd.com",
        password: "Pass@123"
      }
    );
    expect(validationErrors && !!validationErrors.getErrors().length).toBe(
      false
    );
  });
});
