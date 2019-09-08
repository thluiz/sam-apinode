import * as uuid from "uuid/v4";
import { ErrorCode } from "./errors-codes";
import { replaceErrors } from "./replace-errors";

export class SuccessResult<T = any> {
    public static GeneralOk<T>(data?: T): SuccessResult<T> {
        return new SuccessResult<T>("GENERIC_ACTION", data);
    }

    public static Ok<T>(type: string, data?: T): SuccessResult<T> {
        return new SuccessResult<T>(type, data);
    }

    public id: string;
    public success = true;

    private constructor(public type: string, public data: T,
                        public message?: string, public details?: string) {
        this.id = uuid();
    }
}

// tslint:disable-next-line:max-classes-per-file
export class ErrorResult {
    public static Fail(code: ErrorCode, error: Error, innerError?: ErrorResult): ErrorResult {
        return new ErrorResult(error, code, innerError);
    }

    public id: string;
    public success = false;
    public message: string;
    public data: Error;
    public details: string;

    private constructor(error: Error,
                        public errorCode: ErrorCode,
                        public innerError?: ErrorResult) {
        this.id = uuid();
        this.data = error;
        this.message = error ? error.message : null;
        this.details = JSON.stringify(error, replaceErrors);
    }
}

export type Result<T= any> = SuccessResult<T> | ErrorResult;
