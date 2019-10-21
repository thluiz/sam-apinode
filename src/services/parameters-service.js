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
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Branch_1 = require("../entity/Branch");
const BranchCategory_1 = require("../entity/BranchCategory");
const Card_1 = require("../entity/Card");
const Country_1 = require("../entity/Country");
const Location_1 = require("../entity/Location");
const Person_1 = require("../entity/Person");
const PersonCard_1 = require("../entity/PersonCard");
const PersonCardPosition_1 = require("../entity/PersonCardPosition");
const Voucher_1 = require("../entity/Voucher");
const errors_codes_1 = require("../helpers/errors-codes");
const result_1 = require("../helpers/result");
const firebase_emitter_decorator_1 = require("../decorators/firebase-emitter-decorator");
const trylog_decorator_1 = require("../decorators/trylog-decorator");
const base_service_1 = require("./base-service");
const PARAMETERS_COLLECTION = "parameters-events";
const BRANCH_CREATED = "BRANCH_CREATED";
const BRANCH_UPDATED = "BRANCH_UPDATED";
const BRANCH_CATEGORY_GI = 1;
const VOUCHER_CREATED = "VOUCHER_CREATED";
const VOUCHER_UPDATED = "VOUCHER_UPDATED";
const BRANCHVOUCHER_CREATED = "BRANCH_VOUCHER_CREATED";
const BRANCHVOUCHER_REMOVED = "BRANCH_VOUCHER_REMOVED";
const NOTHING_CHANGED = "NOTHING_CHANGED";
class ParametersService extends base_service_1.BaseService {
    save_voucher(voucherData) {
        return __awaiter(this, void 0, void 0, function* () {
            const VR = yield this.databaseManager.getRepository(Voucher_1.Voucher);
            return result_1.SuccessResult.Ok(voucherData.id > 0 ? VOUCHER_UPDATED : VOUCHER_CREATED, yield VR.save(voucherData));
        });
    }
    create_branch_voucher(branch, voucher) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const VR = yield (yield this.queryRunner).manager.getRepository(Voucher_1.Voucher);
                // load relation
                voucher = yield VR.findOne(voucher.id, { relations: ["branches"] });
                if (voucher.branches.find((b) => b.id === branch.id) != null) {
                    return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.NothingChanged, null);
                }
                voucher.branches.push(branch);
                yield VR.save(voucher);
                return result_1.SuccessResult.Ok(BRANCHVOUCHER_CREATED, {
                    branch, voucher
                });
            }
            catch (error) {
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        });
    }
    remove_branch_voucher(branch, voucher) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const VR = yield (yield this.queryRunner).manager.getRepository(Voucher_1.Voucher);
                const voucherBranches = yield VR.findOne(voucher.id, { relations: ["branches"] });
                if (!voucherBranches.branches.find((b) => b.id === branch.id)) {
                    return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.NothingChanged, null);
                }
                voucherBranches.branches = voucherBranches.branches.filter((b) => b.id !== branch.id);
                yield VR.save(voucherBranches);
                return result_1.SuccessResult.Ok(BRANCHVOUCHER_REMOVED, {
                    branch, voucher
                });
            }
            catch (error) {
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        });
    }
    update_branch(branch) {
        return __awaiter(this, void 0, void 0, function* () {
            const BR = yield (yield this.queryRunner).manager.getRepository(Branch_1.Branch);
            return result_1.SuccessResult.Ok(BRANCH_UPDATED, yield BR.save(branch));
        });
    }
    create_branch(branchData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.databaseManager.ExecuteWithinTransaction((qr) => __awaiter(this, void 0, void 0, function* () {
                const BR = qr.manager.getRepository(Branch_1.Branch);
                const BCR = qr.manager.getRepository(BranchCategory_1.BranchCategory);
                const location = yield this.create_location(qr, branchData);
                let branch = new Branch_1.Branch();
                branch.abrev = branchData.abrev;
                branch.active = true;
                branch.category = yield BCR.findOne(branchData.category_id);
                branch.has_voucher = false;
                branch.initials = branchData.initials;
                branch.name = branchData.name;
                branch.location = location;
                branch.order = branchData.order;
                branch = yield BR.save(branch);
                if (branchData.category_id === BRANCH_CATEGORY_GI) {
                    const PR = qr.manager.getRepository(Person_1.Person);
                    const director = yield PR.findOne(branchData.director_id);
                    const dirAdj = yield PR.findOne(branchData.associate_director_id);
                    yield this.create_organization(qr, branch, location, director, dirAdj);
                }
                return result_1.SuccessResult.Ok(BRANCH_CREATED, branch);
            }));
        });
    }
    create_organization(qr, branch, location, director, associateDirector) {
        return __awaiter(this, void 0, void 0, function* () {
            const CR = qr.manager.getRepository(Card_1.Card);
            const PCR = qr.manager.getRepository(PersonCard_1.PersonCard);
            const PCPR = qr.manager.getRepository(PersonCardPosition_1.PersonCardPosition);
            const directorPosition = yield PCPR.findOne(1);
            let organization = new Card_1.Card();
            organization.archived = false;
            organization.cancelled = false;
            organization.abrev = branch.abrev;
            organization.automatically_generated = true;
            organization.title = branch.name;
            organization.location = location;
            organization.leader = director;
            organization.card_template_id = 6;
            organization = yield CR.save(organization);
            const dir = new PersonCard_1.PersonCard();
            dir.person = director;
            dir.position = directorPosition;
            dir.position_description = "Diretor";
            dir.card = organization;
            yield PCR.save(dir);
            const dirAdj = new PersonCard_1.PersonCard();
            dirAdj.person = associateDirector;
            dirAdj.position = directorPosition;
            dirAdj.position_description = "Diretor Adjunto";
            dirAdj.card = organization;
            yield PCR.save(dirAdj);
            return organization;
        });
    }
    create_location(qr, branchData) {
        return __awaiter(this, void 0, void 0, function* () {
            const CR = qr.manager.getRepository(Country_1.Country);
            const LR = qr.manager.getRepository(Location_1.Location);
            let location = new Location_1.Location();
            location.name = branchData.name;
            location.country = yield CR.findOne(branchData.country_id);
            location.active = true;
            location.order = 0;
            location = yield LR.save(location);
            return location;
        });
    }
}
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(PARAMETERS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Voucher_1.Voucher]),
    __metadata("design:returntype", Promise)
], ParametersService.prototype, "save_voucher", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(PARAMETERS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Branch_1.Branch, Voucher_1.Voucher]),
    __metadata("design:returntype", Promise)
], ParametersService.prototype, "create_branch_voucher", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(PARAMETERS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Branch_1.Branch, Voucher_1.Voucher]),
    __metadata("design:returntype", Promise)
], ParametersService.prototype, "remove_branch_voucher", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(PARAMETERS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Branch_1.Branch]),
    __metadata("design:returntype", Promise)
], ParametersService.prototype, "update_branch", null);
__decorate([
    trylog_decorator_1.tryLogAsync(),
    firebase_emitter_decorator_1.firebaseEmitter(PARAMETERS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ParametersService.prototype, "create_branch", null);
exports.ParametersService = ParametersService;
//# sourceMappingURL=parameters-service.js.map