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
const showdown = require("showdown");
const base_repository_1 = require("./base-repository");
const trylog_decorator_1 = require("../decorators/trylog-decorator");
const result_1 = require("../helpers/result");
const Incident_1 = require("../entity/Incident");
const database_manager_1 = require("../services/managers/database-manager");
const dependency_manager_1 = require("../services/managers/dependency-manager");
const cache_decorator_1 = require("../decorators/cache-decorator");
const converter = new showdown.Converter();
const DBM = dependency_manager_1.DependencyManager.container.resolve(database_manager_1.DatabaseManager);
class IncidentsRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(Incident_1.Incident);
        this.summaryCache = [];
    }
    getOwnershipDataForCoverage(ownershipId) {
        return __awaiter(this, void 0, void 0, function* () {
            const execution = yield this.DBM
                .ExecuteJsonSP("getOwnershipDataForCoverage", { ownership_id: ownershipId });
            return execution;
        });
    }
    getOwnershipsFromSchedule(ownershipScheduleId, showPast) {
        return __awaiter(this, void 0, void 0, function* () {
            const execution = yield this.DBM
                .ExecuteJsonSP("GetOwnershipsFromSchedule", { ownership_schedule_id: ownershipScheduleId }, { show_past: showPast });
            return execution;
        });
    }
    getIncidentsWithOutOwnership(branchId, locationId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.DBM.ExecuteJsonSP("GetIncidentsWithOutOwnership", { branch_id: branchId > 0 ? branchId : null }, { location_id: locationId > 0 ? locationId : null }, { start_date: startDate }, { end_date: endDate });
        });
    }
    getAgenda(branchId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.DBM.ExecuteJsonSP("GetAgenda3", { branch_id: branchId }, { date });
        });
    }
    getAvailableOwnerships(branchId, date, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.DBM.ExecuteJsonSP("GetAvailableOwnerships", { branch_id: branchId }, { date }, { type });
            return result;
        });
    }
    getCalendarData(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.DBM.ExecuteJsonSP("GetCalendarData", { start_date: startDate }, { end_date: endDate });
            return result;
        });
    }
    getDataForChangeOwnership(ownershipId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.DBM.ExecuteJsonSP("GetDataForChangeOwnership", { ownership_id: ownershipId });
            return result;
        });
    }
    getDataForChangeOwnershipLength(ownershipId, newStart, newEnd) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.DBM.ExecuteJsonSP("GetDataForChangeOwnershipLength", { ownership_id: ownershipId }, { start_date: newStart }, { end_date: newEnd });
            return result;
        });
    }
    getCurrentActivities(branchId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.DBM.ExecuteJsonSP("GetCurrentActivities", { branch_id: branchId });
            return result;
        });
    }
    getPeopleSummary(branchId, weekModifier, date) {
        return __awaiter(this, void 0, void 0, function* () {
            this.summaryCache = this.summaryCache
                .filter((c) => c.lastcall < ((new Date()).getTime() - 10000)); // clear every 10 seconds
            const cached = this.summaryCache = this.summaryCache
                .filter((c) => c.branch === branchId
                && c.week_modifier === weekModifier
                && c.date === date);
            if (cached.length > 0) {
                return cached[0].result;
            }
            const result = yield this.DBM.ExecuteJsonSP("GetPeopleSummary", { branch: branchId }, { week_modifier: weekModifier }, { date });
            this.summaryCache.push({
                branch: branchId,
                week_modifier: weekModifier,
                date,
                lastcall: (new Date()).getTime(),
                result
            });
            return result;
        });
    }
    getSummary(branchId, monthModifier, weekModifier, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.DBM.ExecuteJsonSP("GetPeopleSummary", { branch: branchId }, { month_modifier: monthModifier }, { week_modifier: weekModifier }, { date });
        });
    }
    getDailyMonitor(branchId, display, displayModifier) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.DBM.ExecuteJsonSP("GetDailyMonitor2", { branch: branchId }, { display_modifier: displayModifier }, { display });
        });
    }
    getPersonIncidentsHistory(personId, startDate, endDate, activityType) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.DBM.ExecuteJsonSP("GetPersonIncidentHistory2", { person_id: personId }, { start_date: startDate }, { end_date: endDate }, { activity_type: activityType });
        });
    }
    getIncidentDetails(incidentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.DBM.ExecuteJsonSP("GetIncidentDetails", { id: incidentId });
        });
    }
    getOwnershipData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ownershipData = yield this.DBM.ExecuteJsonSP("getOwnershipData", {
                ownership_id: id
            });
            const data = ownershipData.data[0];
            console.log(data);
            if (!data.incidents) {
                data.incidents = [];
            }
            for (const incident of data.incidents) {
                if (incident.description) {
                    const d = incident.description.replace(/\r?\n/g, "<br />");
                    incident.description = converter.makeHtml(d);
                }
                if (incident.close_text) {
                    const d = incident.close_text.replace(/\r?\n/g, "<br />");
                    incident.close_text = converter.makeHtml(d);
                }
            }
            return result_1.SuccessResult.GeneralOk(data);
        });
    }
}
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IncidentsRepository.prototype, "getOwnershipDataForCoverage", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Boolean]),
    __metadata("design:returntype", Promise)
], IncidentsRepository.prototype, "getOwnershipsFromSchedule", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsRepository.prototype, "getIncidentsWithOutOwnership", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsRepository.prototype, "getAgenda", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsRepository.prototype, "getAvailableOwnerships", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsRepository.prototype, "getCalendarData", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IncidentsRepository.prototype, "getDataForChangeOwnership", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsRepository.prototype, "getDataForChangeOwnershipLength", null);
__decorate([
    cache_decorator_1.cache(true, 100000, (branchId) => `getCurrentActivities_${branchId || "all"}`),
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IncidentsRepository.prototype, "getCurrentActivities", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsRepository.prototype, "getPeopleSummary", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsRepository.prototype, "getSummary", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsRepository.prototype, "getDailyMonitor", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsRepository.prototype, "getPersonIncidentsHistory", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IncidentsRepository.prototype, "getIncidentDetails", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IncidentsRepository.prototype, "getOwnershipData", null);
exports.IncidentsRepository = IncidentsRepository;
//# sourceMappingURL=incidents-repository.js.map