"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaValidator = exports.SchemaValidationError = void 0;
var logger_1 = require("@vs-org/logger");
var genericUtils_1 = __importDefault(require("./utils/genericUtils"));
var validations_1 = __importStar(require("./utils/validations"));
var SchemaValidationError = /** @class */ (function () {
    function SchemaValidationError() {
        this.errors = [];
    }
    SchemaValidationError.prototype.addError = function (error) {
        this.errors.push(error);
    };
    SchemaValidationError.prototype.addErrors = function (errors) {
        this.errors = __spreadArray(__spreadArray([], __read(this.errors), false), __read(errors), false);
    };
    SchemaValidationError.prototype.getErrors = function () {
        return this.errors;
    };
    SchemaValidationError.prototype.hasSchemaValidationError = function () {
        return !!this.errors.length;
    };
    return SchemaValidationError;
}());
exports.SchemaValidationError = SchemaValidationError;
var logger = logger_1.Logger.getInstance("info");
var SchemaValidator = /** @class */ (function () {
    function SchemaValidator(_a) {
        var allErrors = _a.allErrors;
        this.allErrors = allErrors;
        this.schemas = {};
        this.compiledSchemas = {};
    }
    SchemaValidator.getInstance = function (_a) {
        var allErrors = _a.allErrors;
        if (!SchemaValidator.instance) {
            SchemaValidator.instance = new SchemaValidator({
                allErrors: !!allErrors
            });
        }
        return SchemaValidator.instance;
    };
    SchemaValidator.prototype.addSchema = function (name, schema) {
        this.schemas[name] = schema;
    };
    SchemaValidator.prototype.validate = function (name, object) {
        var e_1, _a;
        var log = logger.getLogger("".concat(SchemaValidator.name, ".validate"));
        log.info("validating object against schema(".concat(name, ")"));
        var schemaValidationError = new SchemaValidationError();
        if (!(0, validations_1.isObject)(object)) {
            schemaValidationError.addError({
                field: "payload",
                error: "Payload(".concat(name.split(".").pop(), ") should be valid object")
            });
            return schemaValidationError;
        }
        try {
            for (var _b = __values(Object.keys(this.schemas[name].properties)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var property = _c.value;
                var _d = this.schemas[name].properties[property], _e = _d.required, required = _e === void 0 ? false : _e, _f = _d.type, type = _f === void 0 ? "String" : _f, validator = _d.validator;
                if (!(property in object) && !required) {
                    continue;
                }
                if (type === "Object") {
                    var validationResult = this.validate("".concat(name, ".").concat(property), genericUtils_1.default.getValueFromObject(object, property));
                    if (validationResult.hasSchemaValidationError()) {
                        schemaValidationError.addErrors(validationResult.getErrors());
                    }
                    continue;
                }
                if (validator && (0, validations_1.isFunction)(validator)) {
                    var validationMsg = validator(genericUtils_1.default.getValueFromObject(object, property));
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
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return schemaValidationError;
    };
    /**
     * Returns validate function which will take object as parameter to validate
     */
    SchemaValidator.prototype.compile = function (name, _schema) {
        var e_2, _a;
        var _this = this;
        var log = logger.getLogger("".concat(SchemaValidator.name, ".compile"));
        log.info("compiling schema validation for schema(".concat(name, ")"));
        if ((this.schemas[name] && !(0, validations_1.isObject)(_schema)) ||
            (_schema && (0, validations_1.isObject)(_schema))) {
            log.debug("schema was provided to compile function, adding schema to collection, if already exist it will be with new schema");
            _schema && this.addSchema(name, _schema);
        }
        else {
            log.error("compilation of schema(".concat(name, ") failed because no schema is not an object, skipping compilation"));
            return function () { };
        }
        var schema = this.schemas[name];
        if (!schema) {
            log.error("compilation of schema(".concat(name, ") failed because no schema found, skipping compilation"));
            return function () { };
        }
        if ((0, validations_1.isEmptyObject)(schema)) {
            return function (value) {
                return _this.validate(name, value);
            };
        }
        var _loop_1 = function (property) {
            var _d = schema.properties[property], nullable = _d.nullable, items = _d.items, itemsFrom = _d.itemsFrom, oneOf = _d.oneOf, required = _d.required, minLength = _d.minLength, maxLength = _d.maxLength, minLowerCase = _d.minLowerCase, minUpperCase = _d.minUpperCase, minNumbers = _d.minNumbers, minSymbols = _d.minSymbols, maxConsecutiveChars = _d.maxConsecutiveChars, validator = _d.validator;
            //Nested schema add recursive function
            var validators = [];
            validators.push(validations_1.default.isTypeMatches);
            //Nullable validation
            if (!nullable) {
                validators.push(validations_1.default.isNullable);
            }
            //Items validation
            if (items) {
                validators.push(validations_1.default.isItemsArray);
            }
            //ItemsFrom validation
            if (itemsFrom) {
                validators.push(validations_1.default.isArrayWithItemsFrom);
            }
            //Oneof validation
            if (oneOf) {
                validators.push(validations_1.default.isValueOneOfArray);
            }
            //Required validation
            if (required) {
                validators.push(validations_1.default.isRequired);
            }
            //minLength validation
            if (minLength) {
                validators.push(validations_1.default.isMinLength);
            }
            //maxLength validation
            if (maxLength) {
                validators.push(validations_1.default.isMaxLength);
            }
            //minLowercase validation
            if (minLowerCase) {
                validators.push(validations_1.default.isMinLowerCase);
            }
            //minUppercase validation
            if (minUpperCase) {
                validators.push(validations_1.default.isMinUpperCase);
            }
            //minUppercase validation
            if (minNumbers) {
                validators.push(validations_1.default.isMinUpperCase);
            }
            //minSymbols validation
            if (minSymbols) {
                validators.push(validations_1.default.isMinSymbols);
            }
            //maxConsecutiveChars validation
            if (maxConsecutiveChars) {
                validators.push(validations_1.default.isMaxConsecutiveCharsExceed);
            }
            //Custom validation
            if (validator && (0, validations_1.isFunction)(validator)) {
                log.info("Schema has custom validator function, please note custom functions should return true or false as result in any case. True for successful validation, and false for failed validation");
                validators.push(validator);
                return "continue";
            }
            schema.properties[property].validator = function (value) {
                log.debug("Validating for property ".concat(property));
                var isValid = validations_1.default.validate(property, value, validators, schema.properties[property]);
                log.debug("Validation result for property ".concat(property, " : ").concat(isValid));
                if (isValid) {
                    return "";
                }
                return (schema.properties[property].errorMessage || "".concat(property, " is not valid"));
            };
        };
        try {
            for (var _b = __values(Object.keys(schema.properties)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var property = _c.value;
                _loop_1(property);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        this.compiledSchemas[name] = schema;
        log.info("compiled schema validation for schema(".concat(name, ")"));
        return function (value) {
            return _this.validate(name, value);
        };
    };
    return SchemaValidator;
}());
exports.SchemaValidator = SchemaValidator;
