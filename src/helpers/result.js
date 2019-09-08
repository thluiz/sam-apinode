"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid/v4");
const replace_errors_1 = require("./replace-errors");
class SuccessResult {
    constructor(type, data, message, details) {
        this.type = type;
        this.data = data;
        this.message = message;
        this.details = details;
        this.success = true;
        this.id = uuid();
    }
    static GeneralOk(data) {
        return new SuccessResult("GENERIC_ACTION", data);
    }
    static Ok(type, data) {
        return new SuccessResult(type, data);
    }
}
exports.SuccessResult = SuccessResult;
// tslint:disable-next-line:max-classes-per-file
class ErrorResult {
    constructor(error, errorCode, innerError) {
        this.errorCode = errorCode;
        this.innerError = innerError;
        this.success = false;
        this.id = uuid();
        this.data = error;
        this.message = error ? error.message : null;
        this.details = JSON.stringify(error, replace_errors_1.replaceErrors);
    }
    static Fail(code, error, innerError) {
        return new ErrorResult(error, code, innerError);
    }
}
exports.ErrorResult = ErrorResult;
//# sourceMappingURL=result.js.map