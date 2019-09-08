import * as crypto from "crypto";

import { PasswordRequest } from "../entity/PasswordRequest";
import { Person } from "../entity/Person";
import { User } from "../entity/User";

import { UsersRepository } from "../repositories/users-repository";

import { tryLogAsync } from "../decorators/trylog-decorator";
import { BaseService } from "./base-service";

import { ErrorCode } from "../helpers/errors-codes";
import { ErrorResult, Result, SuccessResult } from "../helpers/result";
import { UtilsService } from "./utils-service";

import { PasswordRequestReport } from "./reports/password-request-report";

export enum Permissions {
  Operator,
  Manager,
  Director
}

export class SecurityService extends BaseService {
  public static sha512(password, salt) {
    const s = salt || UtilsService.genRandomString(120);
    const hash = crypto.createHmac("sha512", s.toString());
    hash.update(password);
    const value = hash.digest("hex");

    return {
      salt,
      passwordHash: value
    };
  }

  private UR = new UsersRepository();

  @tryLogAsync()
  async serializeUser(user: User): Promise<any> {
    if (user == null) {
      return null;
    }

    await user.loadPersonIfNeeded();

    const response: any = {
      name: user.person.name,
      is_director: user.is_director,
      is_manager: user.is_manager,
      is_operator: user.is_operator,
      avatar_img: user.person.avatar_img,
      person_id: user.person.id,
      email: user.email,
      token: user.token,
      default_branch_id: user.default_branch_id
    };

    if (user.person.default_page != null) {
      response.default_page_id = user.person.default_page.id[0];
      response.default_page = user.person.default_page.name;
      response.default_page_url = user.person.default_page.url;
    }

    return response;
  }

  @tryLogAsync()
  async resetPassword(token, password, confirm): Promise<Result> {
    if (password !== confirm) {
      return ErrorResult.Fail(
        ErrorCode.GenericError,
        new Error("Por favor, confirme a senha")
      );
    }

    const PRR = await this.databaseManager.getRepository<PasswordRequest>(
      PasswordRequest
    );

    const PR = await this.databaseManager.getRepository<Person>(Person);

    const pr = await PRR.manager
      .createQueryBuilder(PasswordRequest, "pr")
      .innerJoinAndSelect("pr.person", "p")
      .where("pr.token = :token", { token })
      .getOne();

    if (!pr) {
      return ErrorResult.Fail(
        ErrorCode.GenericError,
        new Error("Token não encontrado ou já utilizado. Solicite um novo.")
      );
    }

    const validatePassword = this.validatePassword(password);

    if (!validatePassword.success) {
      return validatePassword;
    }

    const person = pr.person;
    person.salt = UtilsService.genRandomString(120);
    person.password = SecurityService.sha512(password, person.salt).passwordHash;

    await PR.save(person);
    await PRR.delete(pr);

    return SuccessResult.GeneralOk();
  }

  @tryLogAsync()
  async createPasswordRequest(email): Promise<Result> {
    const PRR = await this.databaseManager.getRepository<PasswordRequest>(
      PasswordRequest
    );

    const resultUser = await this.UR.getUserByEmail(email);

    if (!resultUser || !resultUser.success || !resultUser.data) {
      return SuccessResult.GeneralOk();
    }

    const person = await (resultUser.data as User).getPerson();

    const passwordRequest = new PasswordRequest();
    passwordRequest.person = person;
    passwordRequest.token = UtilsService.genRandomString(10);

    try {
      await PRR.save(passwordRequest);
    } catch (error) {
      return ErrorResult.Fail(ErrorCode.GenericError, error);
    }

    try {
      const emailRequest = new PasswordRequestReport();
      emailRequest.send(resultUser.data as User, passwordRequest);
    } catch (error) {
      return ErrorResult.Fail(ErrorCode.SendingEmail, error);
    }

    return SuccessResult.GeneralOk();
  }

  @tryLogAsync()
  async getUserFromRequest(req): Promise<User> {
    if (process.env.PRODUCTION === "false") {
      const loadUser = await this.UR.getUserByToken(process.env.TOKEN_USER_DEV);

      return loadUser.data as User;
    }

    return req.user;
  }

  @tryLogAsync()
  async checkUserHasPermission(
    user: User,
    permission: Permissions
  ): Promise<boolean> {
    if (user == null || permission == null) {
      return false;
    }

    let hasPermission = false;

    switch (permission) {
      case Permissions.Operator:
        hasPermission =
          (await user.is_operator()) ||
          (await user.is_director()) ||
          (await user.is_manager());
        break;
      case Permissions.Manager:
        hasPermission = (await user.is_director()) || (await user.is_manager());
        break;
      case Permissions.Director:
        hasPermission = await user.is_director();
        break;
    }

    return hasPermission;
  }

  @tryLogAsync()
  async findUser(email, callback) {
    const loadUser = await this.UR.getUserByEmail(email);
    const user = loadUser.data;

    if (!user) {
      callback(null, false);
      return;
    }

    callback(null, user);
  }

  @tryLogAsync()
  async findUserByToken(token, callback?) {
    const loadUser = await this.UR.getUserByToken(token);
    const user = loadUser.data;

    if (!user) {
      if (callback) {
        callback("user not fount", false);
      }
      return;
    }

    if (callback) {
      callback(null, user);
    }

    return user;
  }

  private validatePassword(password): Result {
    if (password.lengh < 8) {
      return ErrorResult.Fail(
        ErrorCode.GenericError,
        new Error("Informe ao menos 8 caracteres para senha")
      );
    }

    if (password.lengh > 16) {
      return ErrorResult.Fail(
        ErrorCode.GenericError,
        new Error("Informe menos de 16 caracteres para senha")
      );
    }

    const hasUpperCase = /[A-Z]/.test(password) ? 1 : 0;
    const hasLowerCase = /[a-z]/.test(password) ? 1 : 0;
    const hasNumbers = /\d/.test(password) ? 1 : 0;
    const hasNonalphas = /\W/.test(password) ? 1 : 0;

    if (hasUpperCase + hasLowerCase + hasNumbers + hasNonalphas < 3) {
      return ErrorResult.Fail(
        ErrorCode.GenericError,
        new Error(
          "A senha deve possuir algum número, caracter especial, letras maiúsculas ou minúsculas"
        )
      );
    }

    return SuccessResult.GeneralOk();
  }
}
