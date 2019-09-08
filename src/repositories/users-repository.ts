import { User } from "../entity/User";
import { BaseRepository } from "./base-repository";

import { cache } from "../decorators/cache-decorator";
import { tryLogAsync } from "../decorators/trylog-decorator";
import { Result, SuccessResult } from "../helpers/result";

export class UsersRepository extends BaseRepository<User> {

    constructor() {
        super(User);
    }

    @cache(true)
    @tryLogAsync()
    async loadAllUserData(userId): Promise<Result<User>> {
        const UR = await this.getRepository();

        const user = await UR.manager
            .createQueryBuilder(User, "u")
            .innerJoinAndSelect("u.person", "p")
            .leftJoinAndSelect("p.default_page", "dp")
            .where("u.id = :id", { id: userId })
            .cache(10000)
            .getOne();

        return SuccessResult.GeneralOk(user);
    }

    @tryLogAsync()
    async loadAllUserDataWithoutCache(userId): Promise<Result<User>> {
        const UR = await this.getRepository();

        const user = await UR.manager
            .createQueryBuilder(User, "u")
            .innerJoinAndSelect("u.person", "p")
            .leftJoinAndSelect("p.default_page", "dp")
            .where("u.id = :id", { id: userId })
            .getOne();

        return SuccessResult.GeneralOk(user);
    }

    @cache(true)
    @tryLogAsync()
    async getUserByToken(token): Promise<Result<User>> {
        const UR = await this.getRepository();

        const user = await UR.manager
            .createQueryBuilder(User, "u")
            .where("u.token = :token", { token })
            .cache(10000)
            .getOne();

        return SuccessResult.GeneralOk(user);
    }

    @cache(true)
    @tryLogAsync()
    async getUserByEmail(email): Promise<Result<User>> {
        const UR = await this.getRepository();

        const user = await UR.manager
            .createQueryBuilder(User, "u")
            .where("u.email = :email", { email })
            .cache(10000)
            .getOne();

        return SuccessResult.GeneralOk(user);
    }

    @tryLogAsync()
    async getUserByEmailWithoutCache(email): Promise<Result<User>> {
        const UR = await this.getRepository();

        const user = await UR.manager
            .createQueryBuilder(User, "u")
            .where("u.email = :email", { email })
            .getOne();

        return SuccessResult.GeneralOk(user);
    }

}
