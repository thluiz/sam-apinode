"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bot = require("./bot");
function initialize(app) {
    const botConnector = bot.initialize();
    app.post("/api/messages", botConnector.listen());
}
exports.initialize = initialize;
//# sourceMappingURL=old-routes.js.map