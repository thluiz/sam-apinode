/* AzureSessionStore
    License: MIT
    Description: An express session store using Azure Storage Tables.
    Based on https://github.com/asilvas/express-session-azure
*/

// tslint:disable:no-console

import { ErrorCode } from "../helpers/errors-codes";
import { ErrorResult, SuccessResult } from "../helpers/result";
import { AzureTableManager } from "../services/managers/azure-tables-manager";

import Session = require("express-session");

const tableName = "AzureSessionStore";

export class AzureSessionStore extends Session.Store {
  private tableSvc;

  constructor(options) {
    super();
    Session.Store.call(this, options);

    this.tableSvc = AzureTableManager.createTableService();
    AzureTableManager.createTableIfNotExists(this.tableSvc, tableName, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }

  get = (sid, cb) => {
    AzureTableManager.retriveEntity(
      this.tableSvc,
      tableName,
      sid,
      (err, result) => {
        if (err) {
          if (err.code === "ResourceNotFound") {
            cb();
          } else {
            cb(err);
          }
        } else {
          cb(null, result);
        }
      }
    );
  }

  set = (sid, session, cb) => {
    const entity = AzureTableManager.buildEntity(sid, session);

    AzureTableManager.insertOrMergeEntity(
      this.tableSvc,
      tableName,
      entity,
      (err, results) => {
        if (err) {
          console.log("AzureSessionStore.set: " + err);
          cb(err.toString(), null);
        } else {
          cb(null, entity);
        }
      }
    );
  }

  destroy = (sid, cb) => {
    this.deleteEntity(this, sid).then((result) => cb(null, result));
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

    return new Promise(async (resolve, reject) => {
      console.log("AzureSessionStore.start_cleaning...");

      try {
        const oldEntries = (await this.retriveOldEntites(self)) as any[];
        const testEntries = (await this.retriveTestEntites(self)) as any[];

        const entries = oldEntries.concat(testEntries);

        let batch = AzureTableManager.createTableBatch();
        for (let i = 0; i < entries.length; i++) {
          batch.deleteEntity(entries[i]);

          if (i > 0 && i % 99 === 0) {
            const result = await AzureTableManager.executeBatch(
              self.tableSvc,
              tableName,
              batch
            );
            console.log(`deleted ${batch.operations.length} entries!`);
            batch = AzureTableManager.createTableBatch();
          }
        }

        if (batch.operations.length > 0) {
          await AzureTableManager.executeBatch(self.tableSvc, tableName, batch);
          console.log(`finally: deleted ${batch.operations.length} entries!`);
        }

        console.log("AzureSessionStore.end_session_cleaning");
        resolve(SuccessResult.GeneralOk());
      } catch (error) {
        reject(ErrorResult.Fail(ErrorCode.GenericError, error));
      }
    });
  }

  private deleteEntity(self, sid) {
    return new Promise((resolve, reject) => {
      AzureTableManager.deleteEntity(
        self.tableSvc,
        tableName,
        sid,

        (errDel, result) => {
          if (errDel) {
            console.log(errDel);
            return;
          }

          resolve(SuccessResult.GeneralOk());
        }
      );
    });
  }

  private async retriveTestEntites(self) {
    return await this._retriveEntites(self, "Test eq ?", true);
  }

  private async retriveOldEntites(self) {
    const currentDate = Math.floor(Date.now() / 1000);
    const expiration =
      currentDate -
      (parseFloat(process.env.SESSION_DURATION_MINUTES) ||
        3600 * 6 /*default 6 hours*/);

    return await this._retriveEntites(self, "CreatedOn le ?", expiration);
  }

  private _retriveEntites(self, query, parameters) {
    return new Promise((resolve, reject) => {
      AzureTableManager.retrieveEntities(
        self.tableSvc,
        tableName,
        query,
        parameters,
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(result.entries);
        }
      );
    });
  }
}
