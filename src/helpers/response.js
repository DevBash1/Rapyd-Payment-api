import httpStatus from "http-status";
import sendJson from "./sendJson";


export default function sendResponse(res, status = 400, success = true, message = "", data={}) {
    const response = {
        status,
        success,
        message,
        data
    }

    return sendJson(res, response)
}
