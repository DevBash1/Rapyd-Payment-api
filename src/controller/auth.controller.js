import prismaDB from "../config/prisma";
import { genHash, compareHash } from "../helpers/";
import customRequestError from "../helpers/response";
import sendResponse from "../helpers/response";
import { validateEmail } from "../utils/validate";
import { genAccessToken, genRefreshToken } from "../helpers/token";
import { genId } from "../helpers";

export default class AuthControler {
  async login(res, payload) {
    if (res === undefined) {
      throw new Error("expected a valid 'res' object but got none ");
    }
    if (Object.entries(payload).length === 0) {
      return sendResponse(
        res,
        400,
        false,
        "failed to log In, missing payload."
      );
    }

    const { email, password } = payload;

    if (email === "") {
      return sendResponse(res, 400, false, "email is missing");
    }

    if (password === "") {
      return sendResponse(res, 400, false, "password is missing");
    }

    if (!validateEmail(email))
      return sendResponse(res, 400, false, "email given is invalid");

    // check if user with this email address already exists

    const userExistsResult = await prismaDB.user.findUnique({
      where: {
        email,
      },
    });

    if (userExistsResult === null)
      return sendResponse(
        res,
        404,
        false,
        "user with this email address doesnt exists"
      );

    // check if password is correct
    const userData = await prismaDB.user.findUnique({
      where: {
        email,
      },
    });

    if (!compareHash(password, userData?.hash))
      return sendResponse(res, 400, false, "password given is incorrect");

    try {
      const userPayload = {
        id: userData?.id,
        username: userData?.username,
        email: userData?.email,
      };
      const refreshToken = genRefreshToken(userPayload);
      const accessToken = genAccessToken(userPayload);

      await prismaDB.user.update({
        where: {
          email,
        },
        data: {
          refreshToken,
        },
      });

      return sendResponse(res, 201, true, "Logged In successfull", {
        ...userPayload,
        accessToken,
      });
    } catch (e) {
      sendResponse(res, 500, false, "something went wrong logging in", {
        error: e.message,
      });
    }
  }

  async register(res, payload) {
    if (res === undefined) {
      throw new Error("expected a valid 'res' object but got none ");
    }
    if (Object.entries(payload).length === 0) {
      return sendResponse(
        res,
        400,
        false,
        "failed to register In, missing payload."
      );
    }

    const { username, email, password } = payload;

    if (email === "") {
      return sendResponse(res, 400, false, "email is missing");
    }

    if (username === "") {
      return sendResponse(res, 400, false, "username is missing");
    }

    if (password === "") {
      return sendResponse(res, 400, false, "password is missing");
    }

    if (!validateEmail(email))
      return sendResponse(res, 400, false, "email given is invalid");

    // check if user with this email address already exists

    const userExistsResult = await prismaDB.user.findUnique({
      where: {
        email,
      },
    });

    if (userExistsResult !== null)
      return sendResponse(
        res,
        404,
        false,
        "user with this email address already exists"
      );

    try {
      // save data
      const savedData = await prismaDB.user.create({
        data: {
          id: genId(),
          username,
          email,
          refreshToken: "",
          hash: genHash(password),
        },
      });

      return sendResponse(
        res,
        201,
        true,
        "user registered successfully",
        savedData
      );
    } catch (e) {
      sendResponse(res, 500, false, "something went wrong registering user", {
        error: e.message,
      });
    }
  }
}
