import * as auth from "../middlewares/auth";
import { InvitationsService } from "../services/invitations-service";

import { ErrorCode } from "../helpers/errors-codes";
import { ErrorResult } from "../helpers/result";

export function routes(app) {
    app.post("/api/invitations/change_type",
    auth.ensureLoggedIn(),
    async (req, res) => {
        const indicationId = req.body.id;
        const newType = parseInt(req.body.type, 10);

        if (isNaN(newType)) {
            res.send(ErrorResult.Fail(ErrorCode.GenericError, new Error("Type not defined")));
            return;
        }

        const result = await InvitationsService.change_invite_type(indicationId, newType);

        res.send(result);
    });
}
