import prismaDB from "../config/prisma";
import { genHash, compareHash } from "../helpers/util";
import customRequestError from "../helpers/error";

export default class AuthControler {
  async login(res, payload) {}

  async register(res, payload) {}
}
