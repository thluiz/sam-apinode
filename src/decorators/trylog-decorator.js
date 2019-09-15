"use strict";
// decorator should keep execution context (this).
// Arrow functions does not set this, so it's better keep the traditional function here.
// tslint:disable:only-arrow-functions
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_service_1 = require("../services/logger-service");
const errors_codes_1 = require("../helpers/errors-codes");
const result_1 = require("../helpers/result");
function tryLog() {
    return function (target, method, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            try {
                return originalMethod.apply(this, args);
            }
            catch (error) {
                logger_service_1.LoggerService.error(errors_codes_1.ErrorCode.GenericError, error, {
                    action: method,
                    target,
                    args
                });
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        };
        return descriptor;
    };
}
exports.tryLog = tryLog;
function tryLogAsync() {
    return function (target, method, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const result = yield originalMethod.apply(this, args);
                    return result;
                }
                catch (error) {
                    logger_service_1.LoggerService.error(errors_codes_1.ErrorCode.GenericError, error, {
                        action: method,
                        target,
                        args
                    });
                    return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, error);
                }
            });
        };
        return descriptor;
    };
}
exports.tryLogAsync = tryLogAsync;
//# sourceMappingURL=trylog-decorator.js.map