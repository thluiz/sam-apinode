// decorator should keep execution context (this).
// Arrow functions does not set this, so it's better keep the traditional function here.
// tslint:disable:only-arrow-functions

import { LoggerService } from "../services/logger-service";

import { ErrorCode } from "../helpers/errors-codes";
import { ErrorResult } from "../helpers/result";

export function tryLog() {

    return function( target, method, descriptor ) {
        const originalMethod = descriptor.value;
        descriptor.value =  function(...args) {
            try {
                return originalMethod.apply(this, args);
            } catch (error) {
                LoggerService.error(ErrorCode.GenericError, error, {
                    action: method,
                    target,
                    args
                });

                return ErrorResult.Fail(ErrorCode.GenericError, error);
            }
        };

        return descriptor;
    };
}

export function tryLogAsync() {
    return function( target, method, descriptor ) {
        const originalMethod = descriptor.value;
        descriptor.value = async function(...args) {
            try {
                const result = await originalMethod.apply(this, args);

                return result;
            } catch (error) {
                LoggerService.error(ErrorCode.GenericError, error, {
                    action: method,
                    target,
                    args
                });

                return ErrorResult.Fail(ErrorCode.GenericError, error);
            }
        };

        return descriptor;
    };
}
