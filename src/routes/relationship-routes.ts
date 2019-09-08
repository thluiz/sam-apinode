import * as auth from "../middlewares/auth";
import { RelationshipService } from "../services/relationship-service";

export function routes(app) {
    app.get("/api/relationships/person/:id",
    auth.ensureLoggedIn(),
    async (req, res) => {
        const result = await RelationshipService.load_person_relationship(req.params.id);

        res.send(result);
    });
}
