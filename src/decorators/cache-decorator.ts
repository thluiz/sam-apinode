/// from https://gist.github.com/fracz/972ff3abdaf00b2b6dd94888df0a393b
/// and https://github.com/darrylhodgins/typescript-memoize

let counter = 0;
const cacheMap: Array<Map<any, any>> = [];

export function cache(asyncExec: boolean = false, timeout?: number, hashFunction?: (...args: any[]) => any) {
  return (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    if (descriptor.value != null) {
      descriptor.value = getCacheFunction(propertyKey, descriptor.value, hashFunction, asyncExec, timeout);
    } else if (descriptor.get != null) {
      descriptor.get = getCacheFunction(propertyKey, descriptor.get, hashFunction, asyncExec, timeout);
    } else {
      throw new Error("Only put a Memoize() decorator on a method or get accessor.");
    }
  };
}

export function getMelhodCache(methodName: string): Map<any, any> {
  return cacheMap[methodName];
}

export function refreshMethodCache(methodName: string) {
  cacheMap[methodName] = new Map<any, any>();
}

function getCacheFunction(
  key,
  originalMethod: () => void,
  hashFunction?: (...args: any[]) => any,
  asyncCache = false,
  timeout: number = null
) {

  // The function returned here gets called instead of originalMethod.
  return async function(...args: any[]) {
    let returnedValue: any;

    if (hashFunction || args.length > 0) {
      if (!cacheMap[key]) {
        cacheMap[key] = new Map();
      }

      let hashKey: any;

      if (hashFunction) {
        hashKey = hashFunction.apply(this, args);
      } else if (args.length > 0) {
        hashKey = args[0];
      } else  {
        hashKey = "no_parameters";
      }

      if (cacheMap[key].has(hashKey)) {
        returnedValue = cacheMap[key].get(hashKey);
      } else {
        if (asyncCache) {
          returnedValue = await originalMethod.apply(this, args);
        } else {
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
    } else {
      if (this.hasOwnProperty(key)) {
        returnedValue = this[key];
      } else {
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
  };
}
