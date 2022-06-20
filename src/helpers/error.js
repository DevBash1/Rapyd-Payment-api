import httpStatus from "http-status";
import sendJson from "./sendJson";


export default function customRequestError(res, status = "", errorState = true, message = "") {
    let error = {}
    error["error"] = errorState
    error["status"] = status || httpStatus.INTERNAL_SERVER_ERROR;
    error["message"] = message

    return sendJson(res, error)
}
