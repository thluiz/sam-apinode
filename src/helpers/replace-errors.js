"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function replaceErrors(key, value) {
    if (value instanceof Error) {
        const error = {};
        // tslint:disable-next-line:only-arrow-functions
        Object.getOwnPropertyNames(value).forEach(function (k) {
            error[k] = value[k];
        });
        return error;
    }
    return value;
}
exports.replaceErrors = replaceErrors;
//# sourceMappingURL=replace-errors.js.map