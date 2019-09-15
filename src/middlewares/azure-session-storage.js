"use strict";
/* AzureSessionStore
    License: MIT
    Description: An express session store using Azure Storage Tables.
    Based on https://github.com/asilvas/express-session-azure
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-console
const errors_codes_1 = require("../helpers/errors-codes");
const result_1 = require("../helpers/result");
const azure_tables_manager_1 = require("../services/managers/azure-tables-manager");
const Session = require("express-session");
const tableName = "AzureSessionStore";
class AzureSessionStore extends Session.Store {
    constructor(options) {
        super();
        this.get = (sid, cb) => {
            azure_tables_manager_1.AzureTableManager.retriveEntity(this.tableSvc, tableName, sid, (err, result) => {
                if (err) {
                    if (err.code === "ResourceNotFound") {
                        cb();
                    }
                    else {
                        cb(err);
                    }
                }
                else {
                    cb(null, result);
                }
            });
        };
        this.set = (sid, session, cb) => {
            const entity = azure_tables_manager_1.AzureTableManager.buildEntity(sid, session);
            azure_tables_manager_1.AzureTableManager.insertOrMergeEntity(this.tableSvc, tableName, entity, (err, results) => {
                if (err) {
                    console.log("AzureSessionStore.set: " + err);
                    cb(err.toString(), null);
                }
                else {
                    cb(null, entity);
                }
            });
        };
        this.destroy = (sid, cb) => {
            this.deleteEntity(this, sid).then((result) => cb(null, result));
        };
        Session.Store.call(this, options);
        this.tableSvc = azure_tables_manager_1.AzureTableManager.createTableService();
        azure_tables_manager_1.AzureTableManager.createTableIfNotExists(this.tableSvc, tableName, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
    on(cmd) {
        console.log("AzureSessionStore.on." + cmd);
        return this;
    }
    reap(ms) {
        const thresh = Number(new Date(Number(new Date()) - ms));
        console.log("AzureSessionStore.reap: " + thresh.toString());
    }
    cleanup() {
        const self = this;
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            console.log("AzureSessionStore.start_cleaning...");
            try {
                const oldEntries = (yield this.retriveOldEntites(self));
                const testEntries = (yield this.retriveTestEntites(self));
                const entries = oldEntries.concat(testEntries);
                let batch = azure_tables_manager_1.AzureTableManager.createTableBatch();
                for (let i = 0; i < entries.length; i++) {
                    batch.deleteEntity(entries[i]);
                    if (i > 0 && i % 99 === 0) {
                        const result = yield azure_tables_manager_1.AzureTableManager.executeBatch(self.tableSvc, tableName, batch);
                        console.log(`deleted ${batch.operations.length} entries!`);
                        batch = azure_tables_manager_1.AzureTableManager.createTableBatch();
                    }
                }
                if (batch.operations.length > 0) {
                    yield azure_tables_manager_1.AzureTableManager.executeBatch(self.tableSvc, tableName, batch);
                    console.log(`finally: deleted ${batch.operations.length} entries!`);
                }
                console.log("AzureSessionStore.end_session_cleaning");
                resolve(result_1.SuccessResult.GeneralOk());
            }
            catch (error) {
                reject(result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, error));
            }
        }));
    }
    deleteEntity(self, sid) {
        return new Promise((resolve, reject) => {
            azure_tables_manager_1.AzureTableManager.deleteEntity(self.tableSvc, tableName, sid, (errDel, result) => {
                if (errDel) {
                    console.log(errDel);
                    return;
                }
                resolve(result_1.SuccessResult.GeneralOk());
            });
        });
    }
    retriveTestEntites(self) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._retriveEntites(self, "Test eq ?", true);
        });
    }
    retriveOldEntites(self) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDate = Math.floor(Date.now() / 1000);
            const expiration = currentDate -
                (parseFloat(process.env.SESSION_DURATION_MINUTES) ||
                    3600 * 6 /*default 6 hours*/);
            return yield this._retriveEntites(self, "CreatedOn le ?", expiration);
        });
    }
    _retriveEntites(self, query, parameters) {
        return new Promise((resolve, reject) => {
            azure_tables_manager_1.AzureTableManager.retrieveEntities(self.tableSvc, tableName, query, parameters, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result.entries);
            });
        });
    }
}
exports.AzureSessionStore = AzureSessionStore;
//# sourceMappingURL=azure-session-storage.js.map