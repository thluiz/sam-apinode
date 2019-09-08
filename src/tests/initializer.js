"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-var-requires
require("dotenv").load();
const database_manager_1 = require("../services/managers/database-manager");
// tslint:disable-next-line:only-arrow-functions
after(function (done) {
    const DBM = new database_manager_1.DatabaseManager();
    DBM.CloseConnection().then(done);
});
//# sourceMappingURL=initializer.js.map