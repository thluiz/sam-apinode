import * as bot from "./bot";

export function initialize(app) {
    const botConnector = bot.initialize();

    app.post("/api/messages", botConnector.listen());
}
