import { QueryRunner } from "typeorm";

import { Branch } from "../entity/Branch";
import { BranchCategory } from "../entity/BranchCategory";
import { Card } from "../entity/Card";
import { Country } from "../entity/Country";
import { Location } from "../entity/Location";
import { Person } from "../entity/Person";
import { PersonCard } from "../entity/PersonCard";
import { PersonCardPosition } from "../entity/PersonCardPosition";
import { Voucher } from "../entity/Voucher";

import { ErrorCode } from "../helpers/errors-codes";
import { ErrorResult, Result, SuccessResult } from "../helpers/result";

import { firebaseEmitter } from "../decorators/firebase-emitter-decorator";
import { tryLogAsync } from "../decorators/trylog-decorator";

import { BaseService } from "./base-service";

const PARAMETERS_COLLECTION = "parameters-events";
const BRANCH_CREATED = "BRANCH_CREATED";
const BRANCH_UPDATED = "BRANCH_UPDATED";
const BRANCH_CATEGORY_GI = 1;
const VOUCHER_CREATED = "VOUCHER_CREATED";
const VOUCHER_UPDATED = "VOUCHER_UPDATED";
const BRANCHVOUCHER_CREATED = "BRANCH_VOUCHER_CREATED";
const BRANCHVOUCHER_REMOVED = "BRANCH_VOUCHER_REMOVED";
const NOTHING_CHANGED = "NOTHING_CHANGED";

export interface IBranchData {
    abrev: string;
    name: string;
    initials: string;
    category_id: number;
    country_id: number;
    director_id: number;
    associate_director_id: number;
    order: number;
}

export class ParametersService extends BaseService {
    @tryLogAsync()
    @firebaseEmitter(PARAMETERS_COLLECTION)
    async save_voucher(voucherData: Voucher ): Promise<Result<Voucher>> {
        const VR = await this.databaseManager.getRepository(Voucher);

        return SuccessResult.Ok(voucherData.id > 0 ? VOUCHER_UPDATED : VOUCHER_CREATED,
            await VR.save(voucherData)
        );
    }

    @tryLogAsync()
    @firebaseEmitter(PARAMETERS_COLLECTION)
    async create_branch_voucher(branch: Branch, voucher: Voucher )
    : Promise<Result<{branch: Branch, voucher: Voucher}>> {
        try {
            const VR = await (await this.queryRunner).manager.getRepository<Voucher>(Voucher);

            // load relation
            voucher = await VR.findOne(voucher.id, { relations: ["branches"] });

            if (voucher.branches.find((b) => b.id === branch.id) != null) {
                return ErrorResult.Fail(ErrorCode.NothingChanged, null);
            }

            voucher.branches.push(branch);
            await VR.save(voucher);

            return SuccessResult.Ok(BRANCHVOUCHER_CREATED, {
                branch, voucher
            });
        } catch (error) {
            return ErrorResult.Fail(ErrorCode.GenericError, error);
        }
    }

    @tryLogAsync()
    @firebaseEmitter(PARAMETERS_COLLECTION)
    async remove_branch_voucher(branch: Branch, voucher: Voucher )
    : Promise<Result<{branch: Branch, voucher: Voucher}>> {
        try {
            const VR = await (await this.queryRunner).manager.getRepository<Voucher>(Voucher);

            const voucherBranches = await VR.findOne(voucher.id, { relations: ["branches"] });

            if (!voucherBranches.branches.find((b) => b.id === branch.id)) {
                return ErrorResult.Fail(ErrorCode.NothingChanged, null);
            }

            voucherBranches.branches = voucherBranches.branches.filter((b) => b.id !== branch.id);
            await VR.save(voucherBranches);

            return SuccessResult.Ok(BRANCHVOUCHER_REMOVED, {
                branch, voucher
            });
        } catch (error) {
            return ErrorResult.Fail(ErrorCode.GenericError, error);
        }
    }

    @tryLogAsync()
    @firebaseEmitter(PARAMETERS_COLLECTION)
    async update_branch(branch: Branch): Promise<Result<Branch>> {
        const BR = await (await this.queryRunner).manager.getRepository<Branch>(Branch);
        return SuccessResult.Ok(BRANCH_UPDATED, await BR.save(branch));
    }

    @tryLogAsync()
    @firebaseEmitter(PARAMETERS_COLLECTION)
    async create_branch(branchData: IBranchData): Promise<Result<Branch>> {
        return await this.databaseManager.ExecuteWithinTransaction(async (qr) => {
            const BR = qr.manager.getRepository(Branch);
            const BCR = qr.manager.getRepository(BranchCategory);

            const location = await this.create_location(qr, branchData);

            let branch = new Branch();
            branch.abrev = branchData.abrev;
            branch.active = true;
            branch.category = await BCR.findOne(branchData.category_id);
            branch.has_voucher = false;
            branch.initials = branchData.initials;
            branch.name = branchData.name;
            branch.location = location;
            branch.order = branchData.order;

            branch = await BR.save(branch);

            if (branchData.category_id === BRANCH_CATEGORY_GI) {
                const PR = qr.manager.getRepository(Person);
                const director = await PR.findOne(branchData.director_id);
                const dirAdj = await PR.findOne(branchData.associate_director_id);

                await this.create_organization(qr, branch, location, director, dirAdj);
            }

            return SuccessResult.Ok<Branch>(BRANCH_CREATED, branch);
        });

    }

    private async create_organization(qr: QueryRunner, branch: Branch,
                                      location: Location, director: Person, associateDirector: Person) {
        const CR = qr.manager.getRepository(Card);
        const PCR = qr.manager.getRepository(PersonCard);
        const PCPR = qr.manager.getRepository(PersonCardPosition);
        const directorPosition = await PCPR.findOne(1);

        let organization = new Card();
        organization.archived = false;
        organization.cancelled = false;
        organization.abrev = branch.abrev;
        organization.automatically_generated = true;
        organization.title = branch.name;
        organization.location = location;
        organization.leader = director;
        organization.card_template_id = 6;

        organization = await CR.save(organization);

        const dir = new PersonCard();
        dir.person = director;
        dir.position = directorPosition;
        dir.position_description = "Diretor";
        dir.card = organization;
        await PCR.save(dir);

        const dirAdj = new PersonCard();
        dirAdj.person = associateDirector;
        dirAdj.position = directorPosition;
        dirAdj.position_description = "Diretor Adjunto";
        dirAdj.card = organization;

        await PCR.save(dirAdj);

        return organization;
    }

    private async create_location(qr: QueryRunner, branchData: IBranchData) {
        const CR = qr.manager.getRepository(Country);
        const LR = qr.manager.getRepository(Location);

        let location = new Location();
        location.name = branchData.name;
        location.country = await CR.findOne(branchData.country_id);
        location.active = true;
        location.order = 0;
        location = await LR.save(location);
        return location;
    }
}
