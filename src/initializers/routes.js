"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
function initialize(app, routesDir, level = 0) {
    fs.readdirSync(routesDir).forEach((file) => {
        const fullName = path.join(routesDir, file);
        const stat = fs.lstatSync(fullName);
        if (stat.isDirectory()) {
            initialize(app, fullName);
        }
        else if (file.toLowerCase().indexOf(".js") > 0 && file.toLowerCase().indexOf(".map") < 0) {
            const modulePath = path.join(routesDir, file)
                .replace("src/", "../")
                .replace("src\\", "..\\");
            console.log(modulePath);
            const fn = require(modulePath);
            fn.routes(app);
        }
    });
}
exports.initialize = initialize;
//# sourceMappingURL=routes.js.map