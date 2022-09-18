import { Schema, SchemaError } from "./types/SchemaValidator.types";
export declare class SchemaValidationError {
    private errors;
    constructor();
    addError(error: SchemaError): void;
    addErrors(errors: SchemaError[]): void;
    getErrors(): SchemaError[];
    hasSchemaValidationError(): boolean;
}
export declare class SchemaValidator {
    private allErrors;
    private schemas;
    private compiledSchemas;
    private static instance;
    private constructor();
    static getInstance({ allErrors }: {
        allErrors?: boolean;
    }): SchemaValidator;
    addSchema(name: string, schema: Schema): void;
    validate(name: string, object: {
        [key: string]: any;
    }): SchemaValidationError;
    /**
     * Returns validate function which will take object as parameter to validate
     */
    compile(name: string, _schema?: Schema): Function;
}
