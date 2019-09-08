import * as crypto from "crypto";

export class UtilsService {

    public static genRandomString(length) {
        return crypto
          .randomBytes(Math.ceil(length / 2))
          .toString("hex")
          .slice(0, length);
    }
}
