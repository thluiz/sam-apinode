"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder = require("botbuilder");
function initialize() {
    // Create chat connector for communicating with the Bot Framework Service
    var connector = new builder.ChatConnector({
        appId: process.env.MICROSOFT_APP_ID,
        appPassword: process.env.MICROSOFT_APP_PASSWORD
    });
    const bot = new builder.UniversalBot(connector);
    const recognizer = new builder.LuisRecognizer(process.env.LUIS_ENDPOINT);
    const dialog = new builder.IntentDialog({ recognizers: [recognizer] });
    bot.dialog("/", dialog);
    bot.endConversationAction("reset", "ok, cancelando tudo...", { matches: /^cancelar/i });
    return connector;
}
exports.initialize = initialize;
//# sourceMappingURL=bot.js.map