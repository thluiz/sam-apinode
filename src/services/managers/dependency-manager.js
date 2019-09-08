"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const container = new inversify_1.Container();
class DependencyManager {
    static get container() {
        return container;
    }
}
exports.DependencyManager = DependencyManager;
//# sourceMappingURL=dependency-manager.js.map