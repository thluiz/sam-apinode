export function replaceErrors(key, value) {
  if (value instanceof Error) {
    const error = {};

    // tslint:disable-next-line:only-arrow-functions
    Object.getOwnPropertyNames(value).forEach(function(k) {
      error[k] = value[k];
    });

    return error;
  }

  return value;
}
