// tslint:disable-next-line:no-var-requires
require("dotenv").load();
import { DatabaseManager } from "../services/managers/database-manager";

// tslint:disable-next-line:only-arrow-functions
after(function (done) {
    const DBM = new DatabaseManager();
    DBM.CloseConnection().then(done);
});
