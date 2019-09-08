import "reflect-metadata";

import { injectable } from "inversify";

@injectable()
export class DataRunningConfiguration<T = any> {
    useTransaction: boolean = false;
    shouldCommit: boolean = false;
}
