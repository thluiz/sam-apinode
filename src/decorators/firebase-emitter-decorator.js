"use strict";
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
const firebase_manager_1 = require("../services/managers/firebase-manager");
function firebaseEmitter(collection) {
    return (target, method, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                const result = yield originalMethod.apply(this, args);
                if (result.success && process.env.FIREBASE_EMIT_EVENTS !== "false") {
                    yield firebase_manager_1.FirebaseManager.emit_event(collection, {
                        id: result.id,
                        data: result
                    });
                }
                return result;
            });
        };
        return descriptor;
    };
}
exports.firebaseEmitter = firebaseEmitter;
//# sourceMappingURL=firebase-emitter-decorator.js.map