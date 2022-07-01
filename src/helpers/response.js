import httpStatus from "http-status";

export default function sendResponse(
  res,
  status = 400,
  success = true,
  message = "",
  data = {}
) {
  const response = {
    status,
    success,
    message,
    data,
  };

  return res.status(status).json(response);
}
