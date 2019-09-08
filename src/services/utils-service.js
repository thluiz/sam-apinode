"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
class UtilsService {
    static genRandomString(length) {
        return crypto
            .randomBytes(Math.ceil(length / 2))
            .toString("hex")
            .slice(0, length);
    }
}
exports.UtilsService = UtilsService;
//# sourceMappingURL=utils-service.js.map