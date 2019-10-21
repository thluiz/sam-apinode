"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_manager_1 = require("./managers/database-manager");
const DBM = new database_manager_1.DatabaseManager();
var Configurations;
(function (Configurations) {
    Configurations[Configurations["EMAIL_IM"] = 5] = "EMAIL_IM";
})(Configurations = exports.Configurations || (exports.Configurations = {}));
class Constants {
}
Constants.IncidentTypeOwnership = 36;
Constants.IncidentTypeSupport = 39;
exports.Constants = Constants;
// tslint:disable-next-line:max-classes-per-file
class ConfigurationsService {
    static getConfiguration(configuration) {
        return __awaiter(this, void 0, void 0, function* () {
            const con = yield DBM.getConnection();
            const result = yield con.query(`select [value] from configuration where id = @0`, [configuration.toFixed()]);
            return result[0].value;
        });
    }
}
ConfigurationsService.EMAIL_DEV = process.env.EMAIL_DEV;
exports.ConfigurationsService = ConfigurationsService;
//# sourceMappingURL=configurations-services.js.map