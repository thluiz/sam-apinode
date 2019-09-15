"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const await_to_js_1 = require("await-to-js");
const axios_1 = require("axios");
const azure_session_storage_1 = require("../middlewares/azure-session-storage");
const trylog_decorator_1 = require("../decorators/trylog-decorator");
const errors_codes_1 = require("../helpers/errors-codes");
const result_1 = require("../helpers/result");
class JobsService {
    execute_hourly_jobs() {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            results.push(yield this.cleanup_sessions());
            const err = results.find((r) => !r.success);
            if (err) {
                return err;
            }
            return result_1.SuccessResult.GeneralOk();
        });
    }
    update_voucher_site() {
        return __awaiter(this, void 0, void 0, function* () {
            const [errVoucher, resultVoucher] = yield await_to_js_1.default(axios_1.default.get(process.env.VOUCHER_SITE_UPDATE_URL));
            if (errVoucher || resultVoucher.status !== 200) {
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.ExternalRequestError, errVoucher || new Error(resultVoucher.statusText), null);
            }
            const [errInvites, resultInvites] = yield await_to_js_1.default(axios_1.default.get(process.env.VOUCHER_SITE_UPDATE_INVITES_URL));
            if (errInvites || resultInvites.status !== 200) {
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.ExternalRequestError, errInvites || new Error(resultInvites.statusText), null);
            }
            return result_1.SuccessResult.GeneralOk();
        });
    }
    cleanup_sessions() {
        return __awaiter(this, void 0, void 0, function* () {
            const storage = new azure_session_storage_1.AzureSessionStore({});
            try {
                yield storage.cleanup();
                return result_1.SuccessResult.GeneralOk();
            }
            catch (error) {
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        });
    }
}
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsService.prototype, "execute_hourly_jobs", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsService.prototype, "update_voucher_site", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsService.prototype, "cleanup_sessions", null);
exports.JobsService = JobsService;
//# sourceMappingURL=jobs-service.js.map