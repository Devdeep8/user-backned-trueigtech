// src/middlewares/requestId.middleware.js
import { v6 as uuidv6 } from "uuid";

export function requestIdMiddleware(req, res, next) {
  // Respect upstream request id if exists
  const incomingId = req.headers["x-request-id"];

  const requestId = incomingId || uuidv6();

  req.requestId = requestId;
  res.setHeader("x-request-id", requestId);

  next();
}
