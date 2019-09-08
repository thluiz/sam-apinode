import * as auth from "../../middlewares/auth";
import { FirebaseManager } from "../../services/managers/firebase-manager";

export function routes(app) {
    app.get("/api/firebase/token",
    auth.ensureLoggedIn(),
    async (_, res) => {
        const result = await FirebaseManager.get_token();

        res.send(result);
    });

    app.get("/api/firebase/current_time",
    async (_, res) => {
        const dt = new Date();

        res.send({
            milliseconds:  dt.getTime(),
            date: dt
        });
    });
}
