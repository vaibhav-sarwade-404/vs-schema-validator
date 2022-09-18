"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.isMaxConsecutiveCharsExceed = exports.isMinSymbols = exports.isMinNumbers = exports.isMinUpperCase = exports.isMinLowerCase = exports.isMaxLength = exports.isMinLength = exports.isPositiveNumber = exports.isRequired = exports.isValueOneOfArray = exports.isArrayWithItemsFrom = exports.isItemsArray = exports.isNullable = exports.isEmptyObject = exports.isValidUrl = exports.isNull = exports.isUndefined = exports.isArray = exports.isNumber = exports.isString = exports.isFunction = exports.isObject = exports.isBoolean = exports.isTypeMatches = exports.isValidEmail = void 0;
var logger_1 = require("@vs-org/logger");
var logger = logger_1.Logger.getInstance();
var fileName = "validations";
var emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
var isValidEmail = function (email) {
    return (0, exports.isString)(email) && emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
var isTypeMatches = function (value, _a) {
    var _b = _a.type, type = _b === void 0 ? "String" : _b;
    if (type === "Url") {
        return (0, exports.isValidUrl)(value);
    }
    if (type === "Email") {
        return (0, exports.isValidEmail)(value);
    }
    return Object.prototype.toString.call(value) === "[object ".concat(type, "]");
};
exports.isTypeMatches = isTypeMatches;
var isBoolean = function (value) {
    return (0, exports.isTypeMatches)(value, { type: "Boolean" });
};
exports.isBoolean = isBoolean;
var isObject = function (value) {
    return (0, exports.isTypeMatches)(value, { type: "Object" });
};
exports.isObject = isObject;
var isFunction = function (value) {
    return Object.prototype.toString.call(value) === "[object Function]";
};
exports.isFunction = isFunction;
var isString = function (value) {
    return (0, exports.isTypeMatches)(value, { type: "String" });
};
exports.isString = isString;
var isNumber = function (value) {
    return (0, exports.isTypeMatches)(value, { type: "Number" });
};
exports.isNumber = isNumber;
var isArray = function (value) {
    return (0, exports.isTypeMatches)(value, { type: "Array" });
};
exports.isArray = isArray;
var isUndefined = function (value) {
    return (0, exports.isTypeMatches)(value, { type: "Undefined" });
};
exports.isUndefined = isUndefined;
var isNull = function (value) {
    return (0, exports.isTypeMatches)(value, { type: "Null" });
};
exports.isNull = isNull;
var isValidUrl = function (url) {
    var log = logger.getLogger(exports.isValidUrl.name);
    try {
        new URL(url);
        return true;
    }
    catch (error) {
        log.info("Provided URL is not URL or Something went wrong while checking URL with error: ".concat(error));
    }
    return false;
};
exports.isValidUrl = isValidUrl;
var isEmptyObject = function (obj) {
    return JSON.stringify({}) === JSON.stringify(obj);
};
exports.isEmptyObject = isEmptyObject;
var isNullable = function (value, _a) {
    var _b = _a.nullable, nullable = _b === void 0 ? false : _b;
    if (nullable) {
        return true;
    }
    if ((0, exports.isBoolean)(value)) {
        return value;
    }
    if ((0, exports.isObject)(value)) {
        return !(0, exports.isEmptyObject)(value);
    }
    if ((0, exports.isNumber)(value)) {
        return value > 0;
    }
    return !!value;
};
exports.isNullable = isNullable;
var isItemsArray = function (array, _a) {
    var _b = _a.items, items = _b === void 0 ? ["String"] : _b;
    if (!(0, exports.isArray)(array)) {
        return false;
    }
    return array.every(function (arrayEle) {
        return items.filter(function (itemType) { return !(0, exports.isTypeMatches)(arrayEle, { type: itemType }); });
    });
};
exports.isItemsArray = isItemsArray;
var isArrayWithItemsFrom = function (array, _a) {
    var _b = _a.itemsFrom, itemsFrom = _b === void 0 ? [] : _b;
    if (!(0, exports.isArray)(array)) {
        return false;
    }
    if (itemsFrom && !(0, exports.isArray)(itemsFrom)) {
        return false;
    }
    var ele = array.findIndex(function (arrayEle) {
        return itemsFrom.includes(arrayEle);
    });
    return ele > -1;
};
exports.isArrayWithItemsFrom = isArrayWithItemsFrom;
var isValueOneOfArray = function (value, _a) {
    var _b = _a.oneOf, oneOf = _b === void 0 ? [] : _b;
    var ele = oneOf.findIndex(function (arrayEle) { return arrayEle === value; });
    return ele > -1;
};
exports.isValueOneOfArray = isValueOneOfArray;
var isRequired = function (value) {
    return (0, exports.isNullable)(value, { required: false });
};
exports.isRequired = isRequired;
var isPositiveNumber = function (value) {
    return (0, exports.isNumber)(value) && value >= 0;
};
exports.isPositiveNumber = isPositiveNumber;
var isMinLength = function (value, _a) {
    var _b = _a.minLength, minLength = _b === void 0 ? 0 : _b;
    var log = logger.getLogger("".concat(exports.isMinLength.name));
    if ((0, exports.isArray)(value) || (0, exports.isString)(value)) {
        return value.length >= minLength;
    }
    if ((0, exports.isNumber)(value)) {
        return String(value).length >= minLength;
    }
    log.info("".concat(value, " is of type which we cannot determine minLength. Please check validation schema"));
    return false;
};
exports.isMinLength = isMinLength;
var isMaxLength = function (value, _a) {
    var _b = _a.maxLength, maxLength = _b === void 0 ? 0 : _b;
    var log = logger.getLogger("".concat(exports.isMaxLength.name));
    if ((0, exports.isArray)(value) || (0, exports.isString)(value)) {
        return value.length <= maxLength;
    }
    if ((0, exports.isNumber)(value)) {
        return String(value).length <= maxLength;
    }
    log.info("".concat(value, " is of type which we cannot determine maxLength. Please check validation schema"));
    return false;
};
exports.isMaxLength = isMaxLength;
var isMinLowerCase = function (value, _a) {
    var _b = _a.minLowerCase, minLowerCase = _b === void 0 ? 0 : _b;
    var log = logger.getLogger("".concat(exports.isMinLowerCase.name));
    if ((0, exports.isString)(value)) {
        return ((value || "").match(/[a-z]/g) || []).length >= minLowerCase;
    }
    log.info("".concat(value, " is of type which we cannot find lower cases. Please check validation schema"));
    return false;
};
exports.isMinLowerCase = isMinLowerCase;
var isMinUpperCase = function (value, _a) {
    var _b = _a.minUpperCase, minUpperCase = _b === void 0 ? 0 : _b;
    var log = logger.getLogger("".concat(exports.isMinUpperCase.name));
    if ((0, exports.isString)(value)) {
        return ((value || "").match(/[A-Z]/g) || []).length >= minUpperCase;
    }
    log.info("".concat(value, " is of type which we cannot find lower cases. Please check validation schema"));
    return false;
};
exports.isMinUpperCase = isMinUpperCase;
var isMinNumbers = function (value, _a) {
    var _b = _a.minNumbers, minNumbers = _b === void 0 ? 0 : _b;
    var log = logger.getLogger("".concat(exports.isMinNumbers.name));
    if ((0, exports.isString)(value) || (0, exports.isNumber)(value)) {
        return (((value || String(value || "")).match(/\d/g) || []).length >= minNumbers);
    }
    log.info("".concat(value, " is of type which we cannot find numbers. Please check validation schema"));
    return false;
};
exports.isMinNumbers = isMinNumbers;
var isMinSymbols = function (value, _a) {
    var _b = _a.minSymbols, minSymbols = _b === void 0 ? 0 : _b;
    var log = logger.getLogger("".concat(exports.isMinSymbols.name));
    if ((0, exports.isString)(value)) {
        return (value.match(/[^\p{L}\d\s]/u) || []).length >= minSymbols;
    }
    log.info("".concat(value, " is of type which we cannot find symbols. Please check validation schema"));
    return false;
};
exports.isMinSymbols = isMinSymbols;
var isMaxConsecutiveCharsExceed = function (value, _a) {
    var _b = _a.maxConsecutiveChars, maxConsecutiveChars = _b === void 0 ? 0 : _b;
    var log = logger.getLogger("".concat(exports.isMinSymbols.name));
    if ((0, exports.isString)(value)) {
        var charCountMap_1 = {};
        var valueArray = Array.from(value);
        valueArray.forEach(function (char) {
            char = String(char).toLocaleLowerCase();
            var val = charCountMap_1[char];
            if (val) {
                charCountMap_1[char] += 1;
            }
            else {
                charCountMap_1[char] = 1;
            }
        });
        return !Object.values(charCountMap_1).find(function (charCount) { return charCount > maxConsecutiveChars; });
    }
    log.info("".concat(value, " is of type which we cannot find consecutive characters. Please check validation schema"));
    return false;
};
exports.isMaxConsecutiveCharsExceed = isMaxConsecutiveCharsExceed;
var validate = function (propertyKey, value, validators, validationRule) {
    var e_1, _a;
    var log = logger.getLogger("".concat(fileName, ".").concat(exports.validate.name));
    log.debug("validating for ".concat(propertyKey, " with value as ").concat(value));
    var isValid = true;
    try {
        for (var validators_1 = __values(validators), validators_1_1 = validators_1.next(); !validators_1_1.done; validators_1_1 = validators_1.next()) {
            var validationFunction = validators_1_1.value;
            if ((0, exports.isFunction)(validationFunction)) {
                isValid = validationFunction(value, validationRule);
                log.debug("validation function (".concat(validationFunction.name, ") result: ").concat(isValid));
                if (!isValid) {
                    break;
                }
            }
            else {
                log.info("".concat(validationFunction, " is not a function, skipping this validation function"));
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (validators_1_1 && !validators_1_1.done && (_a = validators_1.return)) _a.call(validators_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    log.debug("validation complete, value for ".concat(propertyKey, " is ").concat(isValid ? "valid" : "invalid"));
    return isValid;
};
exports.validate = validate;
exports.default = {
    isBoolean: exports.isBoolean,
    isObject: exports.isObject,
    isString: exports.isString,
    isNumber: exports.isNumber,
    isNullable: exports.isNullable,
    isEmptyObject: exports.isEmptyObject,
    isTypeMatches: exports.isTypeMatches,
    isItemsArray: exports.isItemsArray,
    isArrayWithItemsFrom: exports.isArrayWithItemsFrom,
    validate: exports.validate,
    isValueOneOfArray: exports.isValueOneOfArray,
    isRequired: exports.isRequired,
    isMinLength: exports.isMinLength,
    isMaxLength: exports.isMaxLength,
    isMinLowerCase: exports.isMinLowerCase,
    isMinUpperCase: exports.isMinUpperCase,
    isMinNumbers: exports.isMinNumbers,
    isMinSymbols: exports.isMinSymbols,
    isMaxConsecutiveCharsExceed: exports.isMaxConsecutiveCharsExceed
};
