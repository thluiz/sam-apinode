import * as auth from "../middlewares/auth";

import { SuccessResult } from "../helpers/result";
import { SecurityService } from "../services/security-service";

export function routes(app) {
    app.get("/api/users/current",
    auth.ensureLoggedIn(),
    async (req, res) => {
        try {
            const userReq = await new SecurityService().getUserFromRequest(req);
            const user = await (new SecurityService()).serializeUser(userReq);
            res.send(SuccessResult.GeneralOk(user));
        } catch (error) {
            res.status(500).json({ error });
        }
    });

    app.post("/api/password_request",
    async (req, res) => {
        const passReq = await new SecurityService().createPasswordRequest(req.body.email);

        res.send(passReq);
    });

    app.post("/api/reset_password",
    async (req, res) => {
        const passReq = await new SecurityService().resetPassword(
            req.body.code,
            req.body.password,
            req.body.confirm
        );

        res.send(passReq);
    });
}
