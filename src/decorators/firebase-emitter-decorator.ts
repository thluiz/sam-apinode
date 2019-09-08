import { Result } from "../helpers/result";
import { FirebaseManager } from "../services/managers/firebase-manager";

export function firebaseEmitter(collection) {
    return ( target, method, descriptor ) => {
        const originalMethod = descriptor.value;
        descriptor.value = async function(...args) {
            const result: Result = await originalMethod.apply(this, args);
            if (result.success && process.env.FIREBASE_EMIT_EVENTS !== "false") {
              await FirebaseManager.emit_event(collection, {
                    id: result.id,
                    data: result
                });
            }

            return result;
        };

        return descriptor;
    };
}
