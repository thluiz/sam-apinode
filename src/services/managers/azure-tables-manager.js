"use strict";
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
const azure = require("azure-storage");
const errors_codes_1 = require("../../helpers/errors-codes");
const replace_errors_1 = require("../../helpers/replace-errors");
const logger_service_1 = require("../logger-service");
class AzureTableManager {
    static createTableService() {
        if (!this.config) {
            this.config = this.loadConfig();
        }
        return azure.createTableService(this.config.name, this.config.accessKey);
    }
    static createTableIfNotExists(tableService, table, callback) {
        tableService.createTableIfNotExists(table, callback);
    }
    static buildEntity(id, data = {}, partition = "principal") {
        const entGen = azure.TableUtilities.entityGenerator;
        return {
            PartitionKey: entGen.String(partition),
            RowKey: entGen.String(id),
            CreatedOn: entGen.Int64(Math.floor(Date.now() / 1000)),
            Test: entGen.Boolean(process.env.PRODUCTION === "false"),
            Content: entGen.String(JSON.stringify(data, replace_errors_1.replaceErrors))
        };
    }
    static insertOrMergeEntity(tableService, table, entity, callback) {
        this.createTableIfNotExists(tableService, table, err => {
            if (err) {
                logger_service_1.LoggerService.error(errors_codes_1.ErrorCode.AzureTableStorage, err);
            }
        });
        tableService.insertOrReplaceEntity(table, entity, callback);
    }
    static retriveEntity(tableService, table, id, callback, partition = "principal") {
        tableService.retrieveEntity(table, partition, id, (err, result, response) => {
            const data = this.treatDataRetrieved(result);
            callback(err, data, response);
        });
    }
    static deleteEntity(tableService, table, id, callback) {
        tableService.deleteEntity(table, this.buildEntity(id), (error, response) => {
            callback(error, response);
        });
    }
    static createTableBatch() {
        return new azure.TableBatch();
    }
    static executeBatch(tableService, table, batch) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                tableService.executeBatch(table, batch, (error, result) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(result);
                });
            });
        });
    }
    static retrieveEntities(tableService, table, query, parameters, callback, limit = 0) {
        let azureQuery = new azure.TableQuery().where(query, parameters);
        if (limit > 0) {
            azureQuery = azureQuery.top(limit);
        }
        tableService.queryEntities(table, azureQuery, null, (error, result, response) => {
            if (error) {
                callback(error, null);
            }
            callback(null, result);
        });
    }
    static loadConfig() {
        return {
            name: process.env.AZURE_STORAGE_NAME,
            accessKey: process.env.AZURE_STORAGE_ACCESS_KEY
        };
    }
    static treatDataRetrieved(data) {
        if (!data) {
            return null;
        }
        return JSON.parse(data.Content._);
    }
}
exports.AzureTableManager = AzureTableManager;
//# sourceMappingURL=azure-tables-manager.js.map