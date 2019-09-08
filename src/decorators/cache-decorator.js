"use strict";
/// from https://gist.github.com/fracz/972ff3abdaf00b2b6dd94888df0a393b
/// and https://github.com/darrylhodgins/typescript-memoize
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
let counter = 0;
const cacheMap = [];
function cache(asyncExec = false, timeout, hashFunction) {
    return (target, propertyKey, descriptor) => {
        if (descriptor.value != null) {
            descriptor.value = getCacheFunction(propertyKey, descriptor.value, hashFunction, asyncExec, timeout);
        }
        else if (descriptor.get != null) {
            descriptor.get = getCacheFunction(propertyKey, descriptor.get, hashFunction, asyncExec, timeout);
        }
        else {
            throw new Error("Only put a Memoize() decorator on a method or get accessor.");
        }
    };
}
exports.cache = cache;
function getMelhodCache(methodName) {
    return cacheMap[methodName];
}
exports.getMelhodCache = getMelhodCache;
function refreshMethodCache(methodName) {
    cacheMap[methodName] = new Map();
}
exports.refreshMethodCache = refreshMethodCache;
function getCacheFunction(key, originalMethod, hashFunction, asyncCache = false, timeout = null) {
    // The function returned here gets called instead of originalMethod.
    return function (...args) {
        return __awaiter(this, void 0, void 0, function* () {
            let returnedValue;
            if (hashFunction || args.length > 0) {
                if (!cacheMap[key]) {
                    cacheMap[key] = new Map();
                }
                let hashKey;
                if (hashFunction) {
                    hashKey = hashFunction.apply(this, args);
                }
                else if (args.length > 0) {
                    hashKey = args[0];
                }
                else {
                    hashKey = "no_parameters";
                }
                if (cacheMap[key].has(hashKey)) {
                    returnedValue = cacheMap[key].get(hashKey);
                }
                else {
                    if (asyncCache) {
                        returnedValue = yield originalMethod.apply(this, args);
                    }
                    else {
                        returnedValue = originalMethod.apply(this, args);
                    }
                    if (returnedValue.success !== undefined && !returnedValue.success) {
                        return returnedValue; // only save cache for success calls
                    }
                    cacheMap[key].set(hashKey, returnedValue);
                    if (timeout > 0) {
                        setTimeout(() => {
                            cacheMap[key].delete(hashKey);
                        }, timeout);
                    }
                }
            }
            else {
                if (this.hasOwnProperty(key)) {
                    returnedValue = this[key];
                }
                else {
                    returnedValue = originalMethod.apply(this, args);
                    Object.defineProperty(this, key, {
                        configurable: false,
                        enumerable: false,
                        writable: false,
                        value: returnedValue
                    });
                }
            }
            return returnedValue;
        });
    };
}
//# sourceMappingURL=cache-decorator.js.map