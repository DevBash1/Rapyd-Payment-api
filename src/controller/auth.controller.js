const { User } = require("../model")
const { genHash, compareHash, genId } = require("../helpers")
const sendResponse = require("../helpers/response")
const { validateEmail, validatePhonenumber } = require("../utils/validate")
const { genAccessToken, genRefreshToken } = require("../helpers/token")


class AuthControler {
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
        const userExistsResult = await User.find({ email });

        if (userExistsResult.length === 0)
            return sendResponse(
                res,
                404,
                false,
                "No user with this email address exists."
            );

        // check if password is correct
        const userData = await User.findOne({ email });

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

            const filter = { email };
            const update = { token: refreshToken };

            await User.findOneAndUpdate(filter, update);

            return sendResponse(res, 201, true, "Logged In successfull", {
                ...userPayload,
                accessToken,
            });
        } catch (e) {
            console.log(e);
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
        const userExistsResult = await User.find({ email });

        if (userExistsResult.length > 0)
            return sendResponse(
                res,
                400,
                false,
                "user with this email already exists"
            );

        try {
            // save data
            const savedData = await User.create({
                id: genId(),
                username,
                email,
                token: "",
                hash: genHash(password),
            });

            return sendResponse(
                res,
                201,
                true,
                "user registered successfully",
                savedData
            );
        } catch (e) {
            sendResponse(
                res,
                500,
                false,
                "something went wrong registering user",
                {
                    error: e.message,
                }
            );
        }
    }
}

module.exports = AuthControler;
