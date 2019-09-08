import * as auth from "../../middlewares/auth";
import { DatabaseManager } from "../../services/managers/database-manager";
import { DependencyManager } from "../../services/managers/dependency-manager";

export function routes(app) {
    const DBM = DependencyManager.container.resolve(DatabaseManager);

    app.get("/api/configurations",
    auth.ensureLoggedIn(),
    async (request, res) => {
        try {
            const result = await DBM.ExecuteJsonListSQL(`select * from [configuration] for json path`);

            res.send(result);
        } catch (error) {
            res.status(500).json(error);
        }
    });
}
