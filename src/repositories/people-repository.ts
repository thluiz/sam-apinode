import { QueryRunner, Repository } from "typeorm";
import { tryLogAsync } from "../decorators/trylog-decorator";
import { Person } from "../entity/Person";
import { Result } from "../helpers/result";
import { DatabaseManager } from "../services/managers/database-manager";

const DBM = new DatabaseManager();

export class PeopleRepository {

    @tryLogAsync()
    static async getRepository(runner?: QueryRunner)
        : Promise<Repository<Person>> {
        return await DBM.getRepository<Person>(Person);
    }

    @tryLogAsync()
    static async getExternalContacts(branchId: number, voucherId: number,
                                     name: string, voucherStatus: number,
                                     peoplePerPage: number, page: number)
    : Promise<Result<any>> {
        return await DBM.ExecuteJsonSP("GetExternalContacts",
            { branch_id: branchId },
            { voucher_id: voucherId },
            { name },
            { voucher_status: voucherStatus },
            { people_per_page: peoplePerPage },
            { page },
        );
    }
}
