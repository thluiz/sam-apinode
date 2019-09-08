import { ErrorCode } from "../../helpers/errors-codes";
import { ErrorResult, Result, SuccessResult } from "../../helpers/result";

import * as admin from "firebase-admin";
import { tryLogAsync } from "../../decorators/trylog-decorator";
import { LoggerService } from "../logger-service";

let db = null;
try {
    admin.initializeApp({
        credential: admin.credential.cert(
            {
                type: "service_account",
                project_id: process.env.FIREBASE_PROJECT_ID,
                private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
                private_key: process.env.FIREBASE_PRIVATE_KEY.split("\\n").join("\n"),
                client_email: process.env.FIREBASE_CLIENT_EMAIL,
                client_id: process.env.FIREBASE_CLIENT_ID,
                auth_uri: "https://accounts.google.com/o/oauth2/auth",
                token_uri: "https://accounts.google.com/o/oauth2/token",
                auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
                client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
            } as any
        )
    });

    db = admin.firestore();
} catch (error) {
    LoggerService.error(ErrorCode.Firebase, error, "Initializing");
}

export class FirebaseManager {
    @tryLogAsync()
    static async get_token(): Promise<Result<string>> {
        const customToken = await admin.auth().createCustomToken(process.env.FIREBASE_UID);

        return SuccessResult.GeneralOk(customToken);
    }

    @tryLogAsync()
    static async emit_event<T>(collection,
                               event: { id: string, data: Result<T> | Error, time?: number })
        : Promise<Result> {

        if (!db) {
            return ErrorResult.Fail(ErrorCode.GenericError, new Error("DB not set- Error emitting event"));
        }

        const docRef = db.collection(collection).doc();
        event.time = event.time || (new Date()).getTime();
        const cache = [];
        event.data = JSON.stringify(event.data, (key, value) => {
            if (typeof value === "object" && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Duplicate reference found
                    try {
                        // If this value does not reference a parent it can be deduped
                        return JSON.parse(JSON.stringify(value));
                    } catch (error) {
                        // discard key if value cannot be deduped
                        return;
                    }
                }

                // Store value in our collection
                cache.push(value);
            }
            return value;
        }) as any;
        const r = await docRef.set(event);

        return SuccessResult.GeneralOk();
    }
}
